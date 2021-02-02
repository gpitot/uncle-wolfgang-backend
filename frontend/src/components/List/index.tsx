import Information from "components/Information";
import React from "react";
import style from "./style.module.scss";

interface IProps {
  headers: Array<string>;
  body: Array<Array<any>>;
  title?: string;
}

const List = ({ title, headers, body }: IProps) => (
  <Information styles={style["table-outer"]}>
    {title && <h3>{title}</h3>}
    <table>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map((row, idx) => (
          <tr key={idx}>
            {row.map((col, idx) => (
              <td key={idx}>{col}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </Information>
);

export default React.memo(List);
