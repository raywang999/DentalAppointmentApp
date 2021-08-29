import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

class MyPagination extends React.Component {
	render() {
		const totalItemCount = this.props.totalItemCount;
		const itemsPerPage = this.props.itemsPerPage;
		const end = Math.ceil(totalItemCount / itemsPerPage);
		const currentActivePage = this.props.currentActivePage;
		const setPagination = this.props.setPagination;
		return (<Pagination>
			<Pagination.First onClick={setPagination.bind(this, 1)} />
			{currentActivePage > 1 && <Pagination.Prev onClick={setPagination.bind(this, currentActivePage - 1)} />}
			{currentActivePage > 3 && <Pagination.Ellipsis />}
			{currentActivePage > 1 && <Pagination.Item onClick={setPagination.bind(this, currentActivePage - 1)}>{currentActivePage - 1}</Pagination.Item>}
			<Pagination.Item active>{currentActivePage}</Pagination.Item>
			{currentActivePage < end && <Pagination.Item onClick={setPagination.bind(this, currentActivePage + 1)}>{currentActivePage + 1}</Pagination.Item>}
			{currentActivePage < end - 2 && <Pagination.Ellipsis />}
			{currentActivePage < end && <Pagination.Next onClick={setPagination.bind(this, currentActivePage + 1)} />}
			<Pagination.Last onClick={setPagination.bind(this, end)} />
		</Pagination>);
	}
};

export default MyPagination;