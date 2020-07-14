import React from 'react';
import ReactDOM from 'react-dom'
import * as d3 from 'd3'
import './App.css';
import { timeFormat } from 'd3';


const request = new XMLHttpRequest();
request.open('Get', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
request.send();
request.onload = function() {
  const json = JSON.parse(request.responseText);

  const h = 600;
  const w = 1300;
  const p = 60;
  d3.utcFormat()

  d3.select('body').append('h1').text('Heatmap of the United States').attr('id', 'title')
  d3.select('body').append('h2').text('Monthly Surface Temps, Base Temp of 8.66 C').attr('id', 'description')
  const svg = d3.select('.App')
                .append('svg')
                .attr('height', h)
                .attr('width', w)

  

  const xScale = d3.scaleTime()
                   .domain([new Date('January 1, ' + d3.min(json['monthlyVariance'], (d) => d['year'])), new Date('January 1, ' + d3.max(json['monthlyVariance'], (d) => d['year'])) ])
                   .range([p, w-p]);
  
  const yScale = d3.scaleTime()
                   .domain([ new Date('12/31/2000'), new Date('1/01/2000')])
                   .range([h-p, p])
                   .clamp(true)



  svg.selectAll('rect')
     .data(json['monthlyVariance']) 
     .enter()
     .append('rect') 
     .attr('x', (d) => xScale(new Date('January 1, ' + d['year'])) ) 
     .attr('y', (d) => h-(h-yScale(new Date((d['month']) + '/01/2000'))-p) -p) 
     .attr('width', 5)
     .attr('height', (d) => (h-p-p)/12)
     .attr('class', 'cell')
     .attr('data-year', (d) => d['year'])
     .attr('data-month', (d) => d['month']-1) 
     .attr('data-temp', (d) => d['variance'])
     .attr('fill', (d) => d['variance'] > 1? 'red' : d['variance'] > 0? 'orange' : d['variance'] > -1? 'purple' : 'green')
             


     const xA = d3.axisBottom(xScale)
                  .ticks(27)

     svg.append('g')
        .attr("transform", "translate(0," + (h-p) + ")")
        .attr('id', 'x-axis')
        .call(xA)
        

     const yA = d3.axisLeft(yScale)
                  .tickFormat(timeFormat("%B"))

     svg.append('g')
     .attr("transform", "translate(" + p + ",0)")
     .attr('id', 'y-axis')
     .call(yA)
     
              
}


class App extends React.Component {
  render() {
    return (
      <div className='App'></div>
    )
  }
}


ReactDOM.render(<App />, document.getElementById('root'))
export default App;
