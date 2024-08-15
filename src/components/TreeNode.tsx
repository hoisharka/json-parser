import {useState} from "react";

type TreeNodeProps = {
  data: unknown;
  label?: string;
};
type TJsonObject = {[p: string]: unknown} | ArrayLike<unknown>
const TreeNode = ({ data, label }: TreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  if (typeof data === 'object' && data !== null) {
    return (
      <div>
        <span onClick={toggleExpand} style={{ cursor: 'pointer' }}>
          {label ? `${label}: ` : ''}
          {isExpanded ? '[-]' : '[+]'}
        </span>

        {isExpanded && (
          <div style={{ paddingLeft: '1rem' }}>
            {Object.entries(data as TJsonObject).map(([key, value]) => (
              <TreeNode key={key} label={key} data={value} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {label ? `${label}: ` : ''}
      {JSON.stringify(data)}
    </div>
  );
};

export default TreeNode