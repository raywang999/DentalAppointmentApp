import React from 'react';
import { Bar } from 'react-chartjs-2';

const BOOKINGS_BUCKETS = {
	'Cheap': 100,
	'Normal': 200,
	'Expensive': 1000000
};

const bookingsChart = (props) => {
	const output = {};
	for (const bucket in BOOKINGS_BUCKETS) {
		const filteredBookingsCount = props.bookings.reduce((prev, curr) => {
			if (curr.event.price < BOOKINGS_BUCKETS[bucket]) {
				return prev + 1;
			}
			return prev;
		}, 0);
		output[bucket] = filteredBookingsCount;
	}
	let sum = 0;
	for (const bucket in BOOKINGS_BUCKETS) {
		output[bucket] -= sum;
		sum += output[bucket];
	}
	console.log(output);
	const data = {
		labels: Object.keys(output),
		datasets: [
			{
				label: '# of Votes',
				data: Object.values(output),
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(255, 159, 64, 0.2)',
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)',
				],
				borderWidth: 1,
			},
		],
	};

	const options = {
		scales: {
			yAxes: [
				{
					ticks: {
						beginAtZero: true,
					},
				},
			],
		},
	};
	return (
		<Bar data={data} options={options} />
	);
};

export default bookingsChart;