import React, { Component } from 'react';
import '../App.css';

import * as d3 from "d3"

class ColorCounts extends Component {
  constructor(props) {
    super(props)
    this.state = {showblank:true}
    this.createBarChart = this.createBarChart.bind(this)

    /**
     * 
     * Visual States
     *  Loading
     *  Display data visualization
     *  Error
     *  No data
     * 
     */
  }

  createBarChart() {
    const node = d3.select(this.node)
    const svg = node.select('svg')
    const width = 200
    const height = 200
    const radius = Math.min(width, height) * 0.5
    const g = svg.append("g").attr("transform", "translate(" + width * 0.5 + ", " + height * 0.5 + ")")
    let  data = this.state.data

    let pie = d3.pie().sort(null).value(function(d) { return d.count})
    let path = d3.arc().outerRadius(radius).innerRadius(radius * 0.5)
    
    let arc = g.selectAll('.arc').data(pie(data)).enter().append("g").attr("class", "arc")
    let getColor = this.getColor
    arc.append("path")
       .on('mouseout', function (d) {
        d3.select(this)
          .style('fill', 
            function (d){ 
              return getColor(d.data.color) })
       })
       .on('mouseover', function (d) {
          d3.select(this)
            .style('fill', '#72b4e0')
       })
       .attr("d", path)
       .attr("fill", function (d) { return getColor(d.data.color) })
       .append('title')
       .text(function (d) {
         return d3.format(",.0f")(d.data.count) + " tickets issued to " + d.data.color.toLowerCase() + " colored vehicles"
       })

    // Create table
    let columns = ['color', 'count']
    // Create a row object for each data element
    let rows = node.select(".colorlist")
                    .select('tbody')
                    .selectAll('tr')
                    .data(data)
                    .enter()
                    .append('tr')
    // Create data element for each row
    rows.selectAll('td')
        .data(
          function (row) {
            return columns.map(
              function (column) {
                return {column: column, value: row[column]}
              }
            )
          }
        )
        .enter()
        .append('td')
        .text(
          function (d) {
            if(typeof(d.value) === 'number') {
              return d3.format(",.0f")(d.value)
            }
            else {
              return d.value
            }
          }
        )
  }

  getColor(clr_name) {
    switch(clr_name) {
      case 'Beige': return "#F5F5DC"
      case 'Black': return "#000000"
      case 'Blue': return "#0000ff"
      case 'Brown': return "#A52A2A"
      case 'Gold': return "#FFD700"
      case 'Green': return "#008000"
      case 'Gray': return "#808080"
      case 'Maroon': return "#800000"
      case 'Orange': return '#FFA500'
      case 'Other': return '#999999'
      case 'Pink': return '#FFC0CB'
      case 'Red': return '#FF0000'
      case 'Silver': return '#C0C0C0'
      case 'Tan': return '#D2B48C'
      case 'Violet': return '#EE82EE'
      case 'Yellow': return '#FFFF00'
      case 'White': return '#FFFFFF'
      default: return '#110000'
    }
  }

  loadData(props) {
    this.setState({showblank:false, loading:true, error:false})
    const url = '/tickets/color/' + this.paramsToQueryString(props.params)
    fetch(url).then(
      (response) => response.json()).then(
        (color_data) => this.setState(
          {
            showblank:false, 
            loading:false, 
            error:false, 
            data:color_data.sort(
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

  // componentWillMount() { }
  // componentDidMount() { }

  componentWillReceiveProps(newProps) {
    this.loadData(newProps)
  }
  
  // shouldComponentUpdate(newProps, newState) { return true }
  // componentWillUpdate(nextProps, nextState) { }
  
  componentDidUpdate(prevProps, prevState) { 
    if(!this.state.error && !this.state.loading) {
      this.createBarChart()
    }
  }
  
  // componentWillUnmount() { }

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
              <span className="card-title center-align">Vehicle Color Counts</span>
              <p className="center-align">There was an error loading data</p>
            </div>
          </div>
        </div>
      } else {
        if(isLoading) {
          return <div className="row"> 
            <div className="card grey lighten-4">
              <div className="card-content">
                <span className="card-title center-align">Vehicle Color Counts</span>
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
                <span className="card-title center-align">Vehicle Color Counts</span>
                <p>This radial chart quantity of tickets isued to vehicles by color. The table below displays the number of tickets.</p>
                <br/>
                <svg width={200} height={200} className="svg-centered"></svg> 
                <table className="colorlist responsive-table">
                  <thead>
                    <tr>
                      <th>Color</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
            </div>
          </div>
        }
      }
    }
  }
}

export default ColorCounts;