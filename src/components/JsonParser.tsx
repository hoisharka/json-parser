import React, { useState } from 'react';
import styles from './JsonParser.module.scss';
import {lenientJsonParse} from "../utils/lenientJsonParse.ts";

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject {
  [key: string]: JsonValue;
}
type JsonArray = JsonValue[];

const JsonValueRenderer: React.FC<{ value: JsonValue }> = ({ value }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation(); // 상위 요소로 이벤트 전파 방지
    setIsOpen(!isOpen);
  };

  if (typeof value === 'object' && value !== null) {
    const isArray = Array.isArray(value);
    const openingBrace = isArray ? '[' : '{';
    const closingBrace = isArray ? ']' : '}';

    return (
      <div className={styles.jsonContainer} onClick={toggleOpen}>
        {isOpen ? (
          <>
            <span>{openingBrace}</span>
            <div className={styles.jsonContent}>
              {Object.entries(value).map(([key, val], index) => (
                <div key={index} className={styles.jsonItem}>
                  {!isArray && <span className={styles.jsonKey}>"{key}": </span>}
                  <JsonValueRenderer value={val} />
                  {index < Object.entries(value).length - 1 && ','}
                </div>
              ))}
            </div>
            <span>{closingBrace}</span>
          </>
        ) : (
          <span>{openingBrace}...{closingBrace}</span>
        )}
      </div>
    );
  } else {
    return (
      <span
        className={
          typeof value === 'string'
            ? styles.jsonString
            : typeof value === 'number'
              ? styles.jsonNumber
              : typeof value === 'boolean'
                ? styles.jsonBoolean
                : styles.jsonNull
        }
      >
                {JSON.stringify(value)}
            </span>
    );
  }
};

function JsonParser() {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [parsedJson, setParsedJson] = useState<JsonValue | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
    try {
      const json: JsonValue = lenientJsonParse(e.target.value);
      setParsedJson(json);
    } catch {
      setParsedJson(null); // Invalid JSON, clear the output
    }
  };

  const handleCopy = () => {
    if (parsedJson) {
      const formattedJson = JSON.stringify(parsedJson, null, 2); // 예쁘게 정렬된 JSON
      navigator.clipboard.writeText(formattedJson)
        .then(() => alert('JSON copied to clipboard'))
        .catch((err: unknown) => {
          if (err instanceof Error) {
            alert(`Failed to copy JSON: ${err.message}`);
          } else {
            alert('Failed to copy JSON: Unknown error');
          }
        });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPane}>
                <textarea
                  value={jsonInput}
                  onChange={handleInputChange}
                  placeholder="Enter JSON string here"
                />
      </div>
      <div className={styles.rightPane}>
        <button className={styles.copyButton} onClick={handleCopy}>Copy JSON</button>
        {parsedJson && (
          <JsonValueRenderer value={parsedJson} />
        )}
      </div>
    </div>
  );
}

export default JsonParser;