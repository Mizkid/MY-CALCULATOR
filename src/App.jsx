import { useState } from "react";

const buttons = [
  { label: "AC", type: "utility" },
  { label: "+/-", type: "utility" },
  { label: "%", type: "utility" },
  { label: "÷", type: "operator" },
  { label: "7", type: "number" },
  { label: "8", type: "number" },
  { label: "9", type: "number" },
  { label: "×", type: "operator" },
  { label: "4", type: "number" },
  { label: "5", type: "number" },
  { label: "6", type: "number" },
  { label: "−", type: "operator" },
  { label: "1", type: "number" },
  { label: "2", type: "number" },
  { label: "3", type: "number" },
  { label: "+", type: "operator" },
  { label: "0", type: "number zero" },
  { label: ".", type: "number" },
  { label: "=", type: "operator" },
];

function App() {
  const [display, setDisplay] = useState("0");
  const [previous, setPrevious] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [finished, setFinished] = useState(false);

  function calculate(a, b, op) {
    if (op === "+") return a + b;
    if (op === "−") return a - b;
    if (op === "×") return a * b;
    if (op === "÷") return b === 0 ? "Error" : a / b;
    return b;
  }

  function format(value) {
    if (typeof value === "string") return value;
    if (!Number.isFinite(value)) return "Error";
    return String(Number(value.toPrecision(10)));
  }

  function handleClick(label) {
    if (label === "AC") {
      setDisplay("0");
      setPrevious(null);
      setOperator(null);
      setWaiting(false);
      setFinished(false);
      return;
    }

    if (label === "+/-") {
      if (display !== "0" && display !== "Error") {
        setDisplay(String(-Number(display)));
      }
      return;
    }

    if (label === "%") {
      if (display !== "Error") {
        setDisplay(format(Number(display) / 100));
      }
      return;
    }

    if (label === ".") {
      if (waiting || finished || display === "Error") {
        setDisplay("0.");
        setWaiting(false);
        setFinished(false);
      } else if (!display.includes(".")) {
        setDisplay(display + ".");
      }
      return;
    }

    if (["+", "−", "×", "÷"].includes(label)) {
      if (display === "Error") return;

      if (operator && !waiting) {
        const result = calculate(previous, Number(display), operator);
        const output = format(result);
        setDisplay(output);
        setPrevious(output === "Error" ? null : Number(output));
      } else {
        setPrevious(Number(display));
      }

      setOperator(label);
      setWaiting(true);
      setFinished(false);
      return;
    }

    if (label === "=") {
      if (operator && previous !== null && !waiting) {
        const result = calculate(previous, Number(display), operator);
        setDisplay(format(result));
        setPrevious(null);
        setOperator(null);
        setWaiting(true);
        setFinished(true);
      }
      return;
    }

    if (/^\d$/.test(label)) {
      if (display === "Error" || waiting || finished) {
        setDisplay(label);
        setWaiting(false);
        setFinished(false);
      } else {
        setDisplay(display === "0" ? label : display + label);
      }
    }
  }

  return (
    <main className="h-[100vh] bg-black text-white flex items-center justify-center px-5 py-8">
      <section className="w-full max-w-[360px]">
        <div className="mb-6 flex items-center justify-between text-sm">
          <span>Calculator</span>
          <span className="text-gray-400">@codewithola</span>
        </div>

        <div
          className="mb-6 flex h-40 items-end justify-end overflow-hidden px-2 pb-2 text-right text-6xl font-light tracking-tight"
          aria-live="polite"
          aria-label={`Display: ${display}`}
        >
          <span className="max-w-full break-all">{display}</span>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {buttons.map((button) => {
            const isUtility = button.type === "utility";
            const isOperator = button.type === "operator";
            const isSelected = operator === button.label && waiting;

            const style = isUtility
              ? "bg-[#A5A5A5] text-black active:bg-gray-300"
              : isOperator
                ? isSelected
                  ? "bg-white text-[#FF9F0A]"
                  : "bg-[#FF9F0A] text-white active:bg-orange-300"
                : "bg-[#333333] text-white active:bg-[#666666]";

            return (
              <button
                key={button.label}
                type="button"
                onClick={() => handleClick(button.label)}
                className={`
                  ${
                    button.type.includes("zero")
                      ? "col-span-2 aspect-auto justify-start pl-8"
                      : "aspect-square justify-center"
                  }
                  ${style}
                  flex items-center rounded-full
                  text-2xl font-normal transition-colors
                  duration-100 select-none
                  focus-visible:outline-2
                  focus-visible:outline-white
                `}
                aria-label={button.label}
              >
                {button.label}
              </button>
            );
          })}
        </div>

      </section>
    </main>
  );
}

export default App;
