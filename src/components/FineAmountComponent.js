import React, { Component } from 'react';

import * as d3 from "d3"

class FineAverage extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.createBarChart = this.createBarChart.bind(this)
  }

  createBarChart() {
    const node = d3.select(this.node)
    let  data = [this.state.data]

    node.selectAll("div")
        .data(data)
        .enter()
        .append("div")
        .text(
          function (d) {
            return "Average: " + d.avg + " Max: " + d.max + " Min:" + d.min
          }
        )
  }

  loadData(props) {
    this.setState({loading:true, error:false})
    const url = '/tickets/average/' + this.paramsToQueryString(props.params)
    fetch(url).then(
      (response) => response.json()).then(
        (average_data) => this.setState(
            {
                loading:false, 
                error:false, 
                data:average_data
            }
        )
    ).catch(
      (error) => this.setState({loading:false, error:true, data:null}))
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
    if(hasError){
      return <div> ERROR </div>
    } else {
      if(isLoading) {
        return <div> LOADING </div>
      } else {
        return <div ref={node => this.node = node} > </div>
      }
    }
  }
}

export default FineAverage;