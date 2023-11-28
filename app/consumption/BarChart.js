'use client';
import * as d3 from 'd3';
import { useRef } from 'react';

export default function Consumption() {
  const svgRef = useRef();
  // Specify the chart’s dimensions.
  const width = 928;
  const height = 600;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 30;
  const marginLeft = 40;

  const sftemp = [
    {
      date: '2010-10-01',
      high: 56,
      low: 51
    },
    {
      date: '2010-10-02',
      high: 57,
      low: 52
    }
  ];

  // Create the positional scales.
  const x = d3
    .scaleUtc()
    .domain(d3.extent(sftemp, (d) => d.date))
    .range([marginLeft, width - marginRight]);

  const y = d3
    .scaleLinear()
    .domain([d3.min(sftemp, (d) => d.low), d3.max(sftemp, (d) => d.high)])
    .nice(10)
    .range([height - marginBottom, marginTop]);

  // Create the area generator.
  const area = d3
    .area()
    .curve(d3.curveStep)
    .x((d) => x(d.date))
    .y0((d) => y(d.low))
    .y1((d) => y(d.high));

  // Create the SVG container.
  const svg = d3.select(svgRef.current);

  svg
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

  // Add the area path.
  svg.append('path').datum(sftemp).attr('fill', 'steelblue').attr('d', area);

  // Add the horizontal axis.
  svg
    .append('g')
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(width / 80)
        .tickSizeOuter(0)
    )
    .call((g) => g.select('.domain').remove());

  // Add the vertical axis, a grid and an axis label.
  svg
    .append('g')
    .attr('transform', `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y))
    .call((g) => g.select('.domain').remove())
    .call((g) =>
      g
        .selectAll('.tick line')
        .clone()
        .attr('x2', width - marginLeft - marginRight)
        .attr('stroke-opacity', 0.1)
    )
    .call((g) =>
      g
        .append('text')
        .attr('x', -marginLeft)
        .attr('y', 10)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'start')
        .text('↑ Temperature (°F)')
    );

  return (
    <div className='h-screen bg-gray-200 dark:bg-gray-700'>
      <h1 className='text-center text-2xl'>Heat Consumption Profile</h1>
      <svg ref={svg}></svg>
    </div>
  );
}
