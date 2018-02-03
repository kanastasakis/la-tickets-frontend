import React, { Component } from 'react';
import '../App.css';

import * as d3 from "d3"

class AvgFinePerDayofWeek extends Component {
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  constructor(props) {
    super(props)
    this.state = {showblank:true}
    this.createBarChart = this.createBarChart.bind(this)
  }

  createBarChart() {
    const node = d3.select(this.node)
    const svg = node.select('svg')

    let chartWidth = Math.max(node.node().clientWidth * 0.75, 300)
    let chartHeight = chartWidth * 0.75
    let chartContentWidth = chartWidth * 0.8;
    let chartContentHeight = chartHeight * 0.8;

    let maxAvg = d3.max(this.state.data, 
      function (d) {
        return d.avg
      })
    let minAvg = d3.min(this.state.data, 
        function (d) {
          return d.avg
      })
    let maxStd = d3.max(this.state.data, 
      function (d) {
        return (d.std != null) ? d.std : 30
      })
    
    let yScale = d3.scaleLinear()
                   .domain([minAvg - maxStd * 2, maxAvg + maxStd * 2 ])
                   .range([0.5 * (chartHeight - chartContentHeight) + chartContentHeight, 0.5 * (chartHeight - chartContentHeight)])
    let xScale = d3.scaleLinear()
                   .domain([0, 1])
                   .range([0.5 * (chartWidth - chartContentWidth), 0.5 * (chartWidth - chartContentWidth) + chartContentWidth])
    
    svg.attr('width', chartWidth)
       .attr('height', chartHeight)

    let bgGroup = svg.append('g')
    
    let dF2 = d3.format("($.2f")
    let dF0 = d3.format("($.0f")

    // Create background rectangle
    bgGroup.append('rect')
       .attr('class', 'chart-bg')
       .attr('width', chartWidth)
       .attr('height', chartHeight)
       .style('fill', '#ffffff')
    // Create chart y axis
    bgGroup.append('rect')
       .attr('class', 'y-axis')
       .attr('width', 1)
       .attr('height', 1 + yScale(minAvg - maxStd * 1.5,) - yScale(maxAvg + maxStd * 1.5))
       .attr('x', 0.5 * (chartWidth - chartContentWidth))
       .attr('y', yScale(maxAvg + maxStd * 1.5))
       .style('fill', '#000000')
    bgGroup.append('rect')
       .attr('class', 'y-axis')
       .attr('width', 1)
       .attr('height', 1 + yScale(minAvg - maxStd * 1.5,) - yScale(maxAvg + maxStd * 1.5))
       .attr('x', 0.5 * (chartWidth - chartContentWidth) + chartContentWidth)
       .attr('y', yScale(maxAvg + maxStd * 1.5))
       .style('fill', '#000000')
    // Create y-axis tick marks
    bgGroup.selectAll('.y-tick-left')
           .data([minAvg - maxStd * 1.5, 0.5 * (maxAvg + minAvg), maxAvg + maxStd * 1.5])
           .enter()
           .append('rect')
           .attr('class', 'y-tick-left')
           .attr('x', 0.5 * (chartWidth - chartContentWidth))
           .attr('y', function (d) {
             return yScale(d)
           })
           .attr('width', 5)
           .attr('height', 1)
    bgGroup.selectAll('.y-tick-right')
           .data([minAvg - maxStd * 1.5, 0.5 * (maxAvg + minAvg), maxAvg + maxStd * 1.5])
           .enter()
           .append('rect')
           .attr('class', 'y-tick-right')
           .attr('x', 0.5 * (chartWidth - chartContentWidth) + chartContentWidth - 5)
           .attr('y', function (d) {
             return yScale(d)
           })
           .attr('width', 5)
           .attr('height', 1)
    bgGroup.selectAll('.y-tick-label-left')
           .data([minAvg - maxStd * 1.5, 0.5 * (maxAvg + minAvg), maxAvg + maxStd * 1.5])
           .enter()
           .append('text')
           .attr('class', 'y-tick-label-left')
           .attr('x', 0.5 * (chartWidth - chartContentWidth) - 5)
           .attr('y', function (d) {
             return yScale(d)
           })
           .style("text-anchor", 'end')
           .text(function (d){
              return dF0(d) 
           })

    let fgGroup = svg.append('g')
    // Create whisker spine
    fgGroup.selectAll('.whisker-spine')
             .data(this.state.data)
             .enter()
             .append('rect')
             .style('fill', '#999999')
             .attr('class', 'whisker-spine')
             .attr('width', 2)
             .attr('height', function (d) {
                return yScale(d.avg - ((d.std != null) ? d.std : 30)) - yScale(d.avg + ((d.std != null) ? d.std : 30))
             })
             .attr('x', function (d, i) {
              return xScale((i + 1) / 8.0) - 1
           })
           .attr('y', function (d) {
             return yScale(d.avg + ((d.std != null) ? d.std : 30))
           })
    // Create whisker top
    fgGroup.selectAll('.whisker-top')
           .data(this.state.data)
           .enter()
           .append('rect')
           .style('fill', '#999999')
           .attr('class', 'whisker-top')
           .attr('width', 10)
           .attr('height', 2)
           .attr('x', function (d, i) {
            return xScale((i + 1) / 8.0) - 5
         })
         .attr('y', function (d) {
           return yScale(d.avg + ((d.std != null) ? d.std : 30))
         })
    // Create whisker bottom
    fgGroup.selectAll('.whisker-bottom')
         .data(this.state.data)
         .enter()
         .append('rect')
         .style('fill', '#999999')
         .attr('class', 'whisker-bottom')
         .attr('width', 10)
         .attr('height', 2)
         .attr('x', function (d, i) {
          return xScale((i + 1) / 8.0) - 5
       })
       .attr('y', function (d) {
         return yScale(d.avg - ((d.std != null) ? d.std : 30))
       })
    // Create indicators for averages
    fgGroup.selectAll('.indicator')
          .data(this.state.data)
          .enter()
          .append('circle')
          .on('mouseout', function (d) {
            d3.select(this)
              .style('fill', '#2980B9')
          })
          .on('mouseover', function (d) {
            d3.select(this)
              .style('fill', '#72b4e0')
          })
          .attr('class', 'indicator')
          .attr('r', 8)
          .attr('cx', function (d, i) {
            return xScale((i + 1) / 8.0)
          })
          .attr('cy', function (d) {
            return yScale(d.avg)
          })
          .style('fill', '#2980B9')
          .append('title')
          .text(function (d) {
            let title = 'Average: ' + dF2(d.avg)
            if(d.std != null) title += ', Standard Deviation: ' + dF2(d.std)
            return title
          })
    // Create labels for days of the week
    fgGroup.selectAll('.days')
          .data(this.days)
          .enter()
          .append('text')
          .attr('class', 'days')
          .attr('x', function (d, i) {
            return xScale((i + 1) / 8.0)
          })
          .attr('y', chartContentHeight + 20)
          .style('fill', '#000000')
          .style('text-anchor', "middle")
          .style('user-select', "none")
          .text(function (d) {
            return d.charAt(0)
          })
          .append('title')
          .text(function (d) {
            return d
          })
  }

  loadData(props) {
    this.setState({showblank:false, loading:true, error:false})
    const url = '/tickets/avgdayofweek/' + this.paramsToQueryString(props.params)
    fetch(url).then(
      (response) => response.json()).then(
        (averages) => this.setState(
          {
            showblank:false, 
            loading:false, 
            error:false, 
            data:averages   
          })
    ).catch(
      (error) => this.setState({showblank:false, loading:false, error:true, data:null}))
  }

  paramsToQueryString(params) {
    let q = '';
    for (let key in params) {
      q += key + "=" + params[key] + "&"
    }
    return (q.length > 0) ? "?" + q : q
  }

  componentWillReceiveProps(newProps) {
    this.loadData(newProps)
  }
  
  componentDidUpdate(prevProps, prevState) { 
    if(!this.state.error && !this.state.loading) {
      this.createBarChart()
    }
  }

  render() {
    const showBlank = this.state.showblank
    const hasError = this.state.error
    const isLoading = this.state.loading
    if(showBlank) {
      return <div></div>
    }
    else {
      if(hasError){
        return <div className="row">
          <div className="card grey lighten-4">
            <div className="card-content">
              <span className="card-title center-align">Fines by Weekday</span>
              <p className="center-align">There was an error loading data</p>
            </div>
          </div>
        </div>
      } else {
        if(isLoading) {
          return <div className="row"> 
            <div className="card grey lighten-4">
              <div className="card-content">
                <span className="card-title center-align">Fines by Weekday</span>
                <p className="center-align">Data is loading. It will arrive shortly.</p>
                <br/>
                <div className="preloader-wrapper active spinner-centered">
                  <div className="spinner-layer spinner-red-only">
                    <div className="circle-clipper left">
                      <div className="circle"></div>
                    </div><div className="gap-patch">
                      <div className="circle"></div>
                    </div><div className="circle-clipper right">
                      <div className="circle"></div>
                    </div>
                  </div>
                </div>
              </div>
              <br/>
            </div>
          </div>
        } else {
          return <div ref={node => this.node = node} className="row">
            <div className="card grey lighten-4">
              <div className="card-content">
                <span className="card-title center-align">Fines by Weekday</span>
                <p>This graph displays the average fine amount issued on the days of the week. The whiskers represent one standard deviation above and below the average.</p>
                <p><b>Usage:</b> Hover over the average value indicator(circle) to view exact values for the average and standard deviation.</p>
                <br/>
                <svg width={200} height={200} className="svg-centered"></svg> 
              </div>
            </div>
          </div>
        }
      }
    }
  }
}

export default AvgFinePerDayofWeek;