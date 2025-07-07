import { React, useState } from "react";
import { Paper, Typography, Grid, Button } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import {evaluate} from 'mathjs';

const Cal = () => {
  const paperStyle = {
    padding: 20,
    height: "auto",
    width: 400,
    margin: "20px auto",
  };
  const [inputValue, setInputValue] = useState("");
  const [isSecondActive, setIsSecondActive] = useState(false);
  const [isDegActive, setIsDegActive] = useState(false);
  const [isCompactMode,setIsCompactMode]=useState(false)

  const getLabels=()=>{
    if(isCompactMode){
      return[
        "AC", "←", "%", "÷",
        "7", "8", "9", "×",
        "4", "5", "6", "-",
        "1", "2", "3", "+",
        <SwapHorizIcon />,"0", ".", "="
      ]
    }
    return[
    "2ⁿᵈ",
    isDegActive?"rad":"deg",
    isSecondActive ? "sin⁻¹" : "sin",
    isSecondActive ? "cos⁻¹" : "cos",
    isSecondActive ? "tan⁻¹" : "tan",
    "^","log","ln","(",")",
    "√x","AC","←","%","÷",
    "x!","7","8","9","×",
    "1/x","4","5","6","-",
    "π","1","2","3","+",
    <SwapHorizIcon />,"e","0",".", "=",
    ];
  };

  const evaluateExpression = () => {
    try {
    let expression = inputValue
      .replace(/÷/g, "/")
      .replace(/×/g, "*")
      .replace(/π/g, "pi")
      .replace(/e/g, "e")
      .replace(/√(\d+)/g, "sqrt($1)")
      .replace(/√\(([^)]+)\)/g, "sqrt($1)")
      .replace(/ln/g, "log")
      .replace(/lg/g, "log10")
      .replace(/(\d+(\.\d+)?)%/g, "($1 * 0.01)")
      .replace(/sin⁻¹/g, "asin")
      .replace(/cos⁻¹/g, "acos")
      .replace(/tan⁻¹/g, "atan")
      .replace(/sin/g, isDegActive?"sin":"sin")
      .replace(/cos/g, isDegActive?"cos":"cos")
      .replace(/tan/g, isDegActive?"tan":"tan")
      .replace(/(\d+)!/g, "factorial($1)");

      const result = evaluate(expression);
      setInputValue(result.toString());
    } catch (error) {
      setInputValue("Error");
    }
  };

  const handleC = (item) => {
    if (item === "=") {
      evaluateExpression();
    } else if (item === "AC") {
      setInputValue("");
    } else if (item === "←") {
      setInputValue((prev) => prev.slice(0, -1));
    } else if (item === "2ⁿᵈ") {
      setIsSecondActive(!isSecondActive);
      if (isDegActive) setIsDegActive(false);
    } else if (item === "deg" || item==="rad") {
      setIsDegActive(!isDegActive);
      if (isSecondActive) setIsSecondActive(false);
    }else if (item.type === SwapHorizIcon) { // Handle swap icon click
      setIsCompactMode(!isCompactMode);
    }else {
      let valueToAdd = item;
      if (["√x","1/x","x!", "ln", "lg", "sin", "cos", "tan", "sin⁻¹", "cos⁻¹", "tan⁻¹"].includes(item)) {
        valueToAdd = {
          "√x": "√",
          "1/x":"^(-1)",
          "x!":"!",
          "ln": "ln(",
          "log": "log10(",
          "sin": "sin(",
          "cos": "cos(",
          "tan": "tan(",
          "sin⁻¹": "asin(",
          "cos⁻¹": "acos(",
          "tan⁻¹": "atan(",
        }[item];
      }
      
      setInputValue(
        (prev) => prev + (typeof valueToAdd === "string" ? valueToAdd : "")
      );
    }
  };

  return (
    <Paper elevation={20} style={paperStyle}>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ width: "95.5%", marginBottom: 10, marginTop: 10, height: 45,padding:"5px", fontSize:"16px",textAlign:"right" }}
      />
      <div
        style={{
          display: "grid",
          gap: "10px",
          gridTemplateColumns: isCompactMode ? "repeat(4, 1fr)" : "repeat(5, 1fr)"

        }}
      >
        {getLabels().map((item, index) => {
          const isNumber = typeof item === "string" && /^[0-9]$/.test(item);
          const isEqual = item === "=";
          return(
          <Button
            onClick={() => handleC(item)}
            key={index}
            variant="outlined"
            fullWidth
            style={{ 
              padding: "10px 0",
              fontSize: "15px",
              backgroundColor: isEqual
                ? "#add8e6" 
                : isNumber
                ? "#f0f0f0"
                : "white",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              textTransform:"none"
            }}
              disabled={
              (item==="2ⁿᵈ" && isDegActive)&&!isCompactMode
              }
          >
            {item}
          </Button>
        );
      })}
      </div>
    </Paper>
  );
};

export default Cal;
