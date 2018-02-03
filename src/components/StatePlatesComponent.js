import React, { Component } from 'react';

import * as d3 from "d3"
import { stack } from 'd3-shape';

class StatePlates extends Component {
  constructor(props) {
    super(props)
    this.state = { showblank: true }
    this.usStates = null
    this.createBarChart = this.createBarChart.bind(this)
  }

  createBarChart() {
    let node = d3.select(this.node)
    let svg = node.select('svg')
    let data = this.state.data

    let width = Math.max(node.node().clientWidth * 0.75, 500)
    let height = width * 0.75
    let maxCount = d3.max(data, function (d) { return d.count })
    let f0 = d3.format(",.0f")

    // Set svg size
    svg.attr('width', width)
      .attr('height', height)

    // Create pojection used to transform geographic points
    let projection = d3.geoAlbersUsa()
      .translate([width * 0.5, height * 0.5])
      .scale([width])

    // Create parser for geo paths
    let path = d3.geoPath()
      .projection(projection)

    // Set interpolator for color
    let color = d3.scaleLog()
      .domain([1, maxCount])
      .range([d3.rgb("#EBF5FB"), d3.rgb("#2980B9")])

    // Define a linear gradient
    let grad = svg.append('defs').append('linearGradient')
    grad.attr('id', 'keygrad')
    grad.append('stop')
      .attr('stop-color', '#EBF5FB')
      .attr('offset', '0%')
      .attr('stop-opacity', 1)
    grad.append('stop')
      .attr('stop-color', '#2980B9')
      .attr('offset', '100%')
      .attr('stop-opacity', 1)

    // Create background
    svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .style('fill', '#ffffff')

    // Create paths
    svg.selectAll('path')
      .data(this.usStates.features)
      .enter()
      .append('path')
      .on('mouseover', function (d) {
        d3.select(this)
          .style('fill', '#999999')
      })
      .on('mouseout', function (d) {
        d3.select(this)
          .style('fill', function (d) {
            // Find the relevant state
            let state = data.filter(
              function (stateData) {
                return stateData.rp_state_plate === d.properties.name
              })

            // Use plate count to select color
            if (state.length > 0) {
              return color(state[0].count)
            }
            else {
              return '#FFFFFF'
            }
          })
      })
      .attr("d", path)
      .style('stroke', '#fff')
      .style('stroke-width', '1')
      .style('fill', function (d) {
        // Find the relevant state
        let state = data.filter(
          function (stateData) {
            return stateData.rp_state_plate === d.properties.name
          })

        // Use plate count to select color
        if (state.length > 0) {
          return color(state[0].count)
        }
        else {
          return '#FFFFFF'
        }
      })
      .append('title')
      .text(function (d) {
        // Find the relevant state
        let state = data.filter(
          function (stateData) {
            return stateData.rp_state_plate === d.properties.name
          })
        // Use plate count to select color
        if (state.length > 0) {
          return f0(state[0].count.toString()) + " issued to plates from " + state[0].rp_state_plate
        }
        else {
          return ""
        }
      })

    // Create choropleth key
    svg.append('rect')
      .attr('x', 20)
      .attr('y', 30)
      .attr('width', 200)
      .attr('height', 10)
      .style('fill', "url(#keygrad)")
    svg.append('rect')
      .attr('x', 20)
      .attr('y', 40)
      .attr('width', 200)
      .attr('height', 1)
      .style('fill', '#000000')
    let keyScale = d3.scaleLog()
      .domain([1, maxCount])
      .range([1, 2])
    svg.selectAll(".key-label")
      .data([0, 0.5, 1])
      .enter()
      .append('text')
      .style('text-anchor', 'middle')
      .style('user-select', 'none')
      .attr('class', 'key-label')
      .attr('y', 25)
      .attr('x', function (d) {
        return 20 + (d * 200)
      })
      .text(function (d) {
        return f0(keyScale.invert(d + 1))
      })

  }

  loadData(props) {
    this.setState({ showblank: false, loading: true, error: false })

    // Load US states outline if necessary, then perform query
    if (this.usStates == null) {
      d3.json(
        "/static/tickets/us-states.json",
        (json) => {
          this.usStates = json
          this.performQuery(props)
        })
    }
    else {
      this.performQuery(props)
    }
  }
  performQuery(props) {
    const url = '/tickets/state/' + this.paramsToQueryString(props.params)
    fetch(url)
      .then((response) => response.json())
      .then((state_data) => {
        // Update component state. This will force a render.        
        this.setState(
          {
            showblank: false,
            loading: false,
            error: false,
            data: state_data.sort(
              function (a, b) {
                return b.count - a.count
              }
            )
          }
        )
      })
      .catch((error) => this.setState({ showblank: false, loading: false, error: true, data: null }))
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
    if (!this.state.error && !this.state.loading) {
      this.createBarChart()
    }
  }

  render() {
    const hasError = this.state.error
    const isLoading = this.state.loading
    const showblank = this.state.showblank

    if (showblank) {
      return <div></div>
    }
    else {
      if (hasError) {
        return <div className="row">
          <div className="card grey lighten-4">
            <div className="card-content">
              <span className="card-title center-align">Vehicle Plate Origin Counts</span>
              <p className="center-align">There was an error loading data</p>
            </div>
          </div>
        </div>
      } else {
        if (isLoading) {
          return <div className="row">
            <div className="card grey lighten-4">
              <div className="card-content">
                <span className="card-title center-align">Vehicle Plate Origin Counts</span>
                <p className="center-align">Data is loading. It will arrive shortly.</p>
                <br />
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
              <br />
            </div>
          </div>
        } else {
          return <div ref={node => this.node = node} className="row">
            <div className="card grey lighten-4">
              <div className="card-content">
                <span className="card-title center-align">Vehicle Plate Origin Counts</span>
                <p>This chloropleth visualizes the quantity of tickets issued to vehicles displaying plates from all the states. The scale is logarithmic.</p>
                <p><b>Usage:</b> Hover over a state to view the number of tickets issued to vehicles displaying a plate from that state.</p>
                <br />
                <svg width={300} height={300} className="svg-centered"></svg>
              </div>
            </div>
          </div>
        }
      }
    }
  }
}

export default StatePlates;