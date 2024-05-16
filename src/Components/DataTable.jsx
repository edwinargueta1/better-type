import React from "react";

export default function DataTable({phraseHistoryData}){



    return (
      <div className="dataTableWrapper">
        <table>
          <tbody>
            <tr className="titleTableData" key={-1}>
              <td>Completed</td>
              <td>WPM</td>
              <td>Accuracy</td>
              <td>Errors</td>
              <td>Run Time</td>
            </tr>
            {phraseHistoryData.map((lesson, index) => {
              return (
                <tr key={index}>
                  <td key={"date"}>{lesson.timeCompleted}</td>
                  <td key={"WPM"}>{(lesson.WPM).toFixed(2)}</td>
                  <td key={"acc"}>{lesson.accuracy}%</td>
                  <td key={"errors"}>{lesson.errors}</td>
                  <td key={"timeCompleted"}>{((lesson.phraseRunTime)/1000).toFixed(2)}s</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
}