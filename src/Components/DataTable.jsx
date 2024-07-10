import React from "react";

export default function DataTable({ phraseHistoryData }) {

  return (
    <div className="dataTableWrapper">
      {(phraseHistoryData.length > 0) ? (
        <table className="recentLessonsTable">
        <thead>
          <tr>
            <th colSpan={5} className="tableTile">Recent Lessons</th>
          </tr>
          <tr className="titleTableData" key={-1}>
            <th>Completed</th>
            <th>WPM</th>
            <th>Accuracy</th>
            <th>Errors</th>
            <th>Run Time</th>
          </tr>

        </thead>
        <tbody>
          {phraseHistoryData.map((lesson, index) => {
            return (
              <tr key={index} className={`dimmed${index+1}`}>
                <td key={"date"}>{new Date(lesson.timeCompleted).toLocaleString()}</td>
                <td key={"WPM"}>{lesson.WPM}</td>
                <td key={"acc"}>{lesson.accuracy}%</td>
                <td key={"errors"}>{lesson.errors}</td>
                <td key={"timeCompleted"}>{lesson.phraseRunTime}s</td>
              </tr>
            );
          })}
        </tbody>
      </table>): ""}
      
    </div>
  );
}