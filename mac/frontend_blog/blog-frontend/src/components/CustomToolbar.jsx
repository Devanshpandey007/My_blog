import React from 'react';

const CustomToolbar = () => (
  <div id="toolbar">
    <select className="ql-font">
      <option value="sans-serif" defaultValue>Sans Serif</option>
      <option value="serif">Serif</option>
      <option value="monospace">Monospace</option>
    </select>
    <select className="ql-size">
      <option value="small">Small</option>
      <option defaultValue>Normal</option>
      <option value="large">Large</option>
      <option value="huge">Huge</option>
    </select>
    <button className="ql-bold"></button>
    <button className="ql-italic"></button>
    <button className="ql-underline"></button>
    <button className="ql-strike"></button>
    <select className="ql-color"></select>
    <select className="ql-background"></select>
    <button className="ql-list" value="ordered"></button>
    <button className="ql-list" value="bullet"></button>
    <button className="ql-align"></button>
    <button className="ql-link"></button>
    <button className="ql-image"></button>
    <button className="ql-video"></button>
    <button className="ql-formula"></button>
    <button className="ql-clean"></button>
  </div>
);

export default CustomToolbar;
