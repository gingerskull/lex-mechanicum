// Tiny arithmetic evaluator for parameter expressions in a record's positions and block inputs:
// numbers, parameter names, + - * / ^, parentheses, unary minus, and sin cos tan sqrt abs (angles in degrees).
import { D2R } from "./math";

export function evalExpr(src: string, lookup: (name: string) => number | undefined): number {
  let i = 0;
  const s = src.trim();
  const peek = () => s[i];
  const ws = () => {
    while (s[i] === " ") i++;
  };
  const fail = (m: string): never => {
    throw new Error(`expression "${src}": ${m}`);
  };
  function primary(): number {
    ws();
    const c = peek();
    if (c === "(") {
      i++;
      const v = sum();
      ws();
      if (peek() !== ")") fail("missing )");
      i++;
      return v;
    }
    if (c === "-") {
      i++;
      return -power();
    }
    if (c === "+") {
      i++;
      return power();
    }
    const num = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i.exec(s.slice(i));
    if (num) {
      i += num[0].length;
      return Number(num[0]);
    }
    const id = /^[A-Za-z_][A-Za-z0-9_]*/.exec(s.slice(i));
    if (!id) return fail(`unexpected "${c ?? "end"}"`);
    i += id[0].length;
    ws();
    if (peek() === "(") {
      i++;
      const a = sum();
      ws();
      if (peek() !== ")") fail("missing )");
      i++;
      switch (id[0]) {
        case "sin":
          return Math.sin(a * D2R);
        case "cos":
          return Math.cos(a * D2R);
        case "tan":
          return Math.tan(a * D2R);
        case "sqrt":
          return Math.sqrt(a);
        case "abs":
          return Math.abs(a);
        default:
          return fail(`unknown function ${id[0]}`);
      }
    }
    const v = lookup(id[0]);
    if (v === undefined) return fail(`unknown name ${id[0]}`);
    return v;
  }
  function power(): number {
    const b = primary();
    ws();
    if (peek() === "^") {
      i++;
      return b ** power();
    }
    return b;
  }
  function product(): number {
    let v = power();
    for (;;) {
      ws();
      const c = peek();
      if (c === "*") {
        i++;
        v *= power();
      } else if (c === "/") {
        i++;
        v /= power();
      } else return v;
    }
  }
  function sum(): number {
    let v = product();
    for (;;) {
      ws();
      const c = peek();
      if (c === "+") {
        i++;
        v += product();
      } else if (c === "-") {
        i++;
        v -= product();
      } else return v;
    }
  }
  const v = sum();
  ws();
  if (i < s.length) fail(`trailing "${s.slice(i)}"`);
  return v;
}
