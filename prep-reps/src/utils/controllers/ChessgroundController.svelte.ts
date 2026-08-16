import type { Key } from "@lichess-org/chessground/types";
import type { Config } from "@lichess-org/chessground/config";
import type { Api } from "@lichess-org/chessground/api";
import { Chess, type NormalMove } from "chessops";
import { INITIAL_FEN, makeFen, parseFen } from "chessops/fen";
import { parseSquare } from "chessops/util";
import { chessgroundMove } from "chessops/compat";

import "$lib/assets/Chessground/chessground.css";
import "$lib/assets/Chessground/theme.css";
import { makeSan, parseSan } from "chessops/san";
import {
  ChildNode,
  Node,
  defaultGame,
  makePgn,
  type Game,
  type PgnNodeData,
} from "chessops/pgn";
import { SvelteMap } from "svelte/reactivity";

export class ChessgroundController {
  protected currentLine: NormalMove[] = [];
  protected config: Config;
  protected chessGame: Game<PgnNodeData>;
  protected chessLogic: Chess;
  public currentPgn: string = $state("");
  public currentInteractivePgn: { label: string; goto: () => void }[] = $state(
    [],
  );
  protected currentMoveNode: Node<PgnNodeData>;

  constructor(
    protected ground: Api,
    protected initialFen: string = INITIAL_FEN,
  ) {
    this.chessGame = defaultGame<PgnNodeData>(
      () => new SvelteMap<string, string>([["FEN", this.initialFen]]),
    );
    this.currentMoveNode = this.chessGame.moves;
    this.chessLogic = Chess.fromSetup(
      parseFen(this.initialFen).unwrap(),
    ).unwrap();

    this.userMove = this.userMove.bind(this);
    this.config = {
      fen: makeFen(this.chessLogic.toSetup()),
      events: {
        move: this.userMove,
      },
      movable: { color: this.chessLogic.turn },
    };
    this.ground.set(this.config);
  }

  reloadAllObjects() {
    // updates everything based on this.currentLine
    this.chessLogic = Chess.fromSetup(
      parseFen(this.initialFen).unwrap(),
    ).unwrap();
    this.currentMoveNode = this.chessGame.moves;

    for (const move of this.currentLine) {
      const san = makeSan(this.chessLogic, move);
      this.currentMoveNode = this.currentMoveNode!.children.find((child) => {
        return child.data.san === san;
      })!;
      this.chessLogic.play(move);
    }

    this.currentPgn = makePgn(this.chessGame);
    this.ground.set({
      fen: makeFen(this.chessLogic.toSetup()),
      movable: { color: this.chessLogic.turn },
      turnColor: this.chessLogic.turn,
      lastMove:
        this.currentLine.length > 0
          ? chessgroundMove(this.currentLine[this.currentLine.length - 1])
          : undefined,
    });
  }

  userMove(from: Key, to: Key) {
    const move = { from: parseSquare(from), to: parseSquare(to) } as NormalMove;

    if (this.chessLogic.isLegal(move)) {
      const san = makeSan(this.chessLogic, move);
      // check if the played move is already present in the move tree
      let newMove = this.currentMoveNode?.children.find((child) => {
        return child.data.san === san;
      });
      if (newMove === undefined) {
        newMove = new ChildNode<PgnNodeData>({
          san: san,
        });

        // push move to game tree
        this.currentMoveNode!.children.push(newMove);
      }
      this.currentMoveNode = newMove;

      // update all objects
      this.chessLogic.play(move);
      this.currentLine.push(move);
      this.currentPgn = makePgn(this.chessGame);
      this.currentInteractivePgn = Array.from(
        this.chessGame.moves.mainlineNodes(),
      ).map((node) => {
        return {
          label: node.data.san,
          goto: () => {
            this.jumpToNode(node);
          },
        };
      });
      this.ground.set({
        movable: { color: this.chessLogic.turn },
        turnColor: this.chessLogic.turn,
      });
    } else {
      console.debug("Incorrect move!", move, { color: this.chessLogic.turn });
      this.ground.set({
        fen: makeFen(this.chessLogic.toSetup()),
        movable: { color: this.chessLogic.turn },
        turnColor: this.chessLogic.turn,
        lastMove:
          this.currentLine.length > 0
            ? chessgroundMove(this.currentLine[this.currentLine.length - 1])
            : undefined,
      });
    }
  }

  findNodeLine = (
    root: Node<PgnNodeData>,
    node: ChildNode<PgnNodeData>,
  ): ChildNode<PgnNodeData>[] => {
    if (root === node) {
      // early break
      return [root as ChildNode<PgnNodeData>];
    }
    let ret: ChildNode<PgnNodeData>[] = [];
    for (const childNode of root.children) {
      let childNodeLine: ChildNode<PgnNodeData>[] = [];
      if (root instanceof ChildNode) {
        // include root unless it's the absolute root of this.chessGame
        childNodeLine.push(root);
      }
      childNodeLine.push(...this.findNodeLine(childNode, node));

      // break if current line contains the searched node
      const nodeIndex = childNodeLine.indexOf(node);
      if (nodeIndex !== -1) {
        ret = childNodeLine.slice(0, nodeIndex + 1);
        break;
      }
    }
    return ret;
  };

  jumpToNode = (node: ChildNode<PgnNodeData>) => {
    const nodeLine = this.findNodeLine(this.chessGame.moves, node);
    this.currentLine = nodeLine.reduce(
      (acc: [Chess, NormalMove[]], curr: ChildNode<PgnNodeData>) => {
        acc[1].push(parseSan(acc[0], curr.data.san) as NormalMove);
        acc[0].play(acc[1].at(-1)!);
        return acc;
      },
      [Chess.fromSetup(parseFen(this.initialFen).unwrap()).unwrap(), []],
    )[1];
    this.reloadAllObjects();
  };

  firstMove = () => {
    this.currentLine = [];
    this.reloadAllObjects();
  };

  prevMove = () => {
    this.currentLine.pop();
    this.reloadAllObjects();
  };

  nextMove = () => {
    // const nextMoveTest = Array.from(this.currentMoveNode.mainlineNodes()).at(0);
    // console.log("next move jumpToNode test");
    // if (nextMoveTest !== undefined) {
    //   this.jumpToNode(nextMoveTest);
    // }
    // return;

    const nextMove = Array.from(this.currentMoveNode.mainline()).at(0);
    if (nextMove !== undefined) {
      const cgMove = chessgroundMove(parseSan(this.chessLogic, nextMove.san)!);
      this.ground.move(cgMove[0], cgMove[1]);
    }
  };

  lastMove = () => {
    // go to the last move of current variation mainline
    const mainline = this.currentMoveNode.mainline();
    for (const node of mainline) {
      const move = parseSan(this.chessLogic, node.san);
      this.chessLogic.play(move!);
      this.currentLine.push(move as NormalMove);
    }
    this.reloadAllObjects();
  };
}
