import React from 'react';
import ReactDOM from 'react-dom'
import * as d3 from 'd3'
import './App.css';
import { timeFormat, timeParse } from 'd3';

const leg = [1,2,3,4,5,6,7,8]

const request = new XMLHttpRequest();
request.open('Get', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
request.send();
request.onload = function() {
  const json = JSON.parse(request.responseText);

  const h = 600;
  const w = 1300;
  const p = 60;
  
  d3.select('.App').append('h1').text('Heatmap of the United States').attr('id', 'title').style('margin-top', '2px'); 
  d3.select('.App').append('h3').html('Monthly Surface Temps, Base Temp of 8.66&#8451;').attr('id', 'description').style('margin-top', '-20px')
  
 

  
  const svg = d3.select('.App')
                .append('svg')
                .attr('height', h)
                .attr('width', w)
                .style('margin-top', '-65px')
                

  let info = d3.select('.App')
               .append('div')
               .style('display', 'none')
               .style('width', "130px")
               .style('height', '60px')
               .style('border-radius', '5%')
               .style('background-color', 'rgb(45, 46, 45, 0.8)')
               .style('position', 'absolute') 
               .style('color', 'white')
               .style('padding', '8px')
               .attr('id', 'tooltip');  //inspired by the last answer on this post (https://www.freecodecamp.org/forum/t/d3-tooltip-wanted-is-that-15-chars-now/92398/6)

  const xScale = d3.scaleTime()
                   .domain([new Date('January 1, ' + d3.min(json['monthlyVariance'], (d) => d['year'])), new Date('January 1, ' + d3.max(json['monthlyVariance'], (d) => d['year'])) ])
                   .range([p, w-p]);
  
  const yScale = d3.scaleBand()
                   .domain(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'])
                   .range([h-p, p])
                   



  svg.selectAll('rect')
     .data(json['monthlyVariance']) 
     .enter()
     .append('rect') 
     .attr('x', (d) => xScale(new Date('January 1, ' + d['year'])) ) 
     .attr('y', (d) => h-(h-yScale((d['month']))-p) -p) 
     .attr('width', 5)
     .attr('height', (d) => (h-p-p)/12)
     .attr('class', 'cell')
     .attr('data-year', (d) => d['year'])
     .attr('data-month', (d) => d['month']-1) 
     .attr('data-temp', (d) => d['variance'])
     .attr('fill', (d) => d['variance'] > 3? '#F03019' : d['variance'] > 2? '#FF592B' : d['variance'] > 1? '#FF9139' : d['variance'] > 0? '#FFCC54' : d['variance'] > -0.5? '#FFFB9E' : d['variance'] > -1? '#97B6FD' : d['variance'] > -2? '#5387FF' : d['variance'] > -3? '#285CCC' : '#285CCC')
     .on('mouseover', function(e) {
          info = info.style('display', 'inline')
                     .attr('data-year', this.getAttribute('data-year') )
                     .attr('data-month', this.getAttribute('data-month') ) 
                     .attr('data-temp', this.getAttribute('data-temp') ) 
                     .style('transform', i => 'translate(' + (this.getAttribute('x')-w-p) + 'px,' + (this.getAttribute('y')-30) + 'px)') 
                     .html(e => '<div>' + this.getAttribute('data-year') + ' - ' + 
                          ( this.getAttribute('data-month') ==0? 'January'
                          : this.getAttribute('data-month') ==1? 'February'
                          : this.getAttribute('data-month') ==2? 'March'
                          : this.getAttribute('data-month') ==3? 'April'
                          : this.getAttribute('data-month') ==4? 'May'
                          : this.getAttribute('data-month') ==5? 'June' 
                          : this.getAttribute('data-month') ==6? 'July' 
                          : this.getAttribute('data-month') ==7? 'August' 
                          : this.getAttribute('data-month') ==8? 'September' 
                          : this.getAttribute('data-month') ==9? 'October' 
                          : this.getAttribute('data-month') ==10? 'November'
                          :  'December') +'</div>'
                          + '<div>' + (Math.round((8.66-this.getAttribute('data-temp'))*100))/100 + '&#8451;</div>'
                          + '<div>' + (Math.round(this.getAttribute('data-temp')*100)/100) + '&#8451;</div>'
                     )
     })              
     .on('mouseout', function(e) {
          info = info.style('display', 'none')
     })

     const xA = d3.axisBottom(xScale)
                  .ticks(27)

     svg.append('g')
        .attr("transform", "translate(0," + (h-p) + ")")
        .attr('id', 'x-axis')
        .call(xA)
        

     const yA = d3.axisLeft(yScale)
                  .tickFormat(d => d== 1? 'January' : d==2? 'February' : d==3? 'March' : d==4? 'April' : d==5? 'May' : d==6? 'June' : d==7? 'July' : d==8? 'August' : d==9? 'September' : d==10? 'October' : d==11? 'November' : 'December')
                  

     svg.append('g')
        .attr("transform", "translate(" + p + ",0)")
        .attr('id', 'y-axis')
        .call(yA)
  
      
     
     const legend = d3.select('.App')
                      .append('svg')
                      .attr('height', 40)
                      .attr('width', 415)
                      .attr('id', 'legend')
                      .style('margin-top', "-40px")
                      .style('text-align', 'right')
     
      legend.selectAll('rect')
           .data(leg) 
           .enter()
           .append('rect') 
           .attr('height', 20)
           .attr('width', 50)
           .attr('x', i => -42.5 + i*50)
           .style('fill', i => i===8? '#F03019' : i===7? '#FF592B' : i===6? '#FF9139' : i===5? '#FFCC54' : i===4? '#FFFB9E' : i==3? '#97B6FD' : i===2? '#5387FF' : '#285CCC')


      const lScale = d3.scaleLinear()
                       .domain([1,8])
                       .range([7,407])
     

const lA = d3.axisBottom(lScale)
             .ticks(8)
             .tickFormat(i=> i===1? "-3.0" : i===2? "-2.0" : i===3? "-1.0" : i===4? "-0.5": i===5? "0" : i===6? '1.0' : i===7? '2.0' : '3.0')

legend.append('g')
      .attr('id', 'leg-axis')
      .attr("transform", "translate(0,20)")
      .call(lA)     
              
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
