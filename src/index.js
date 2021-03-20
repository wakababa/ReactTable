import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ReactTable from './Table';
import reportWebVitals from './reportWebVitals';

const handleData = (data) => { console.log(data) }

ReactDOM.render(
  <React.StrictMode>
    <ReactTable tableData={[{
      name: "Waka",
      age: 28,
      job: "Developer"
    },
    {
      name: "Muro",
      age: 27,
      job: "Photographer"
    }]}
      onLoadData={handleData}
      rowKeys={["name", "age", "job"]}
    />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
