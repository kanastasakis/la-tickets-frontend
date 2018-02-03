import React, { Component } from 'react';
import '../App.css';

import * as d3 from "d3"

class AgencyCounts extends Component {
  constructor(props) {
    super(props)
    this.state = {showblank:true}
    this.createBarChart = this.createBarChart.bind(this)
  }

  createBarChart() {
    let barHeight = 25
    let node = d3.select(this.node)
    let chartWidth = Math.max(node.node().clientWidth * 0.75, 300)
    let data = this.state.data

    // Create Bar chart
    const svg = node.select('svg')
                    .attr('width', chartWidth)
                    .attr('height', barHeight * data.length)
    
    // Create continuous linear interpolator
    let X = d3.scaleLog()
              .domain([1, d3.max(data, function(d) { return d.count }) - 20])
              .range([0, chartWidth * 0.5])

    // Create groupings for rectangle and text elements
    let g = svg.selectAll('g')
                .data(data)
                .enter()
                .append("g")
                .attr("transform", function (d, i) { return "translate(0," + i * barHeight + ")" })

    // Create rectangles
    g.append('rect')
     .on('mouseover', function (d) {
        d3.select(this)
          .style('fill', '#72b4e0') 
      })
      .on('mouseout', function (d) {
        d3.select(this)
          .style('fill', 'lightgray') 
      })
     .style('fill', 'lightgray')
     .attr('x', function (d) { return chartWidth * 0.5 })
     .attr('width', function (d) { return X(d.count) + 20})
     .attr('height', barHeight - 1)
     

    // Add agency counts
    let f0 = d3.format(",.0f")
    g.append("text")
        .style('user-select', 'none')
        .attr('x', function (d) { return chartWidth * 0.5 + 5 })
        .attr('y', barHeight * 0.5)
        .attr("dy", ".35em")
        .text( function (d) { 
          return f0(d.count)
        })
    
    // Agency names
    g.append("text")
      .style('user-select', 'none')
      .style('text-anchor', "end")
      .attr('x', chartWidth * 0.5 - 10)
      .attr('y', barHeight * 0.5)
      .attr("dy", ".35em")
      .text( function (d) { 
        return d.agency
      })
  }

  loadData(props) {
    this.setState({showblank:false, loading:true, error:false})
    const url = '/tickets/agency/' + this.paramsToQueryString(props.params)
    fetch(url).then(
      (response) => response.json()).then(
        (agency_data) => this.setState(
          {
            showblank:false, 
            loading:false, 
            error:false, 
            data:agency_data.sort(
              function (a, b) { 
                return b.count - a.count
              })})
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
    const hasError = this.state.error
    const isLoading = this.state.loading
    const showblank = this.state.showblank

    if(showblank) {
      return <div></div>
    }
    else {
      if(hasError){
        return <div className="row">
          <div className="card grey lighten-4">
              <div className="card-content">
                <span className="card-title center-align">Issuing Agency Counts</span>
                <p className="center-align">There was an error loading data</p>
              </div>
            </div>
        </div>
      } else {
        if(isLoading) {
          return <div className="row"> 
              <div className="card grey lighten-4">
                <div className="card-content">
                  <span className="card-title center-align">Issuing Agency Counts</span>
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
          return  <div ref={node => this.node = node} className="row">
                    <div className="card grey lighten-4">
                      <div className="card-content">
                        <span className="card-title center-align">Issuing Agency Counts</span>
                        <p>This graph displays the number of tickets issued by issuing agency.</p>
                        <br/>
                        <svg width={'100%'} className="agency-chart svg-centered"></svg>
                      </div>
                    </div>
                  </div>
        }
      }
    }
  }
}

export default AgencyCounts;