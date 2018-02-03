import React, { Component } from 'react';
import '../App.css';

import * as d3 from "d3"
import { geoProjection } from 'd3-geo';

class TicketCounts extends Component {
    constructor(props) {
        super(props)
        this.state = {showblank:true}
        this.createBarChart = this.createBarChart.bind(this)
    } 

    createBarChart() {
      let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      let  node = d3.select(this.node)
      let  svg = node.select('svg')

      let minDate = this.state.data[0].date
      let maxDate = this.state.data[this.state.data.length - 1].date
      let monthRange = d3.timeMonths(
        new Date(minDate.getFullYear(), minDate.getMonth(), 1), 
        new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 1))

      let columns = 2
      let chartWidth = Math.max(node.node().clientWidth * 0.75, 300)
      let chartHeight = Math.ceil(monthRange.length  / columns) * (chartWidth / columns)
      let monthBoxSide = chartWidth / columns
      let monthBoxContentSize = monthBoxSide * 0.9

      svg.attr('width', chartWidth)
          .attr('height', chartHeight)
      

      let dayCounts = this.state.data

      let maxDayCount = d3.max(
          dayCounts, 
          function (x) {
              return x.count
          })
      
      let colorDay = d3.scaleLog()
                        .domain([1, maxDayCount])
                        .range([d3.rgb("#EBF5FB"), d3.rgb("#2980B9")])
      
      // Create rectangles for each day of the year
      // Create groups for each month of the year
      let groups = svg.selectAll('g')
                        .data(monthRange)
                        .enter()
                        .append('g')
                        .attr("transform", 
                          function (d, i) { 
                              return "translate(" + monthBoxSide * (i % columns) + "," + monthBoxSide * Math.floor(i / columns) + ")"
                          })
           
      // Create back drop for each month
      groups.append('rect')
            .attr('x', monthBoxSide * 0.05)
            .attr('y', 0)
            .attr('width', monthBoxContentSize)
            .attr('height', monthBoxContentSize)
            .style('fill', '#ffffff')
      
      // Create a label for each month of the year
      groups.append('text')
            .style('text-anchor', "middle")
            .style('user-select', 'none')
            .attr('x', 0.5 * monthBoxSide)
            .attr('y', 16)
            .text(function (d) {
              return months[d.getMonth()] + ' ' + d.getFullYear().toString()
          })
      
      /*days.forEach(function (element, index) {
        groups.append('text')
              .attr('x', function (d) {
                return  monthBoxSide * 0.05 + 0.5 * (monthBoxContentSize / 7) + index * (monthBoxContentSize / 7)
              })
              .attr('y', -10)
              .style('text-anchor', "middle")
              .style('user-select', 'none')
              .text(element.charAt(0))
      })*/

      svg.append('g')
          .attr('id', 'days')
          .selectAll('rect')
          .data(this.state.data)
          .enter()
          .append('rect')
          .on('mouseover', function (d) {
            d3.select(this)
              .style('fill', '#999999')
          })
          .on('mouseout', function (d) {
          d3.select(this)
              .style('fill', function (d) { return colorDay(d.count) })
          })
          .style('stroke', '#fff')
          .style('stroke-width', '1')
          .attr('x', 
          function (d) {
            let mIndex = (d.date.getFullYear() - minDate.getFullYear()) * 12 + d.date.getMonth() - minDate.getMonth()
            let _day = d.date.getDay() // 1 - 31
            return monthBoxSide * (mIndex % columns) + monthBoxSide * 0.05 + (monthBoxContentSize / 7) * _day
          })
          .attr('y', 
          function (d) {
            let mIndex = (d.date.getFullYear() - minDate.getFullYear()) * 12 + d.date.getMonth() - minDate.getMonth()

            let boxSide = (monthBoxContentSize / 7)
            let _day = d.date.getDate() // 1 - 31
            let firstOfMonth = new Date(d.date)
            firstOfMonth.setDate(1)

            let monthOffset = monthBoxSide * Math.floor(mIndex / columns)
            let weekOffset = boxSide * Math.floor((firstOfMonth.getDay() + _day - 1) / 7)

            return (monthBoxContentSize / 7) + monthOffset + weekOffset
          })
          .attr('width', monthBoxContentSize / 7)
          .attr('height', monthBoxContentSize / 7)
          .style('fill', function (d) { return colorDay(d.count) })
          .append('title')
          .text(function (d){
              return d3.format(",.0f")(d.count) + " tickets issued on " + d.date.toDateString()
          })
    }

  loadData(props) {
    this.setState({showblank:false, loading:true, error:false})
    const url = '/tickets/day/' + this.paramsToQueryString(props.params)
    fetch(url).then(
      (response) => response.json()).then(
        (count_data) => {
            count_data.forEach(
                function (element) { 
                    element.date = new Date(element.date)
            })
            count_data.sort(
                function (a, b) { 
                    return a.date - b.date
            })
            this.setState({
                showblank: false, 
                loading: false, 
                error: false, 
                data: count_data
            })
        }
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
              <span className="card-title center-align">Ticket Counts by Date</span>
              <p className="center-align">There was an error loading data</p>
            </div>
          </div>
        </div>
      } else {
        if(isLoading) {
          return <div className="row"> 
            <div className="card grey lighten-4">
              <div className="card-content">
                <span className="card-title center-align">Ticket Counts by Date</span>
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
                <span className="card-title center-align">Ticket Counts by Date</span>
                <p>This graphis displays the number of tickets issued on a particular day as function of color.</p>
                <p><b>Usage:</b> Hover over a day in the calender to view the number of tickets issued.</p>
                <br/>
                <svg width={200} height={200} id={"months"} className="svg-centered"></svg> 
              </div>
            </div>
          </div>
        }
      }
    }
  }
}

export default TicketCounts;