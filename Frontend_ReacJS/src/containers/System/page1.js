// import React, {
//       Component, useEffect,
//       useState
// } from 'react';
// import { Redirect } from 'react-router-dom';
// import { connect } from 'react-redux';

// import { get } from 'lodash';
// import { withRouter } from "react-router";
// import moment from 'moment';
// import localization from 'moment/locale/vi';
// import ReactPaginate from 'react-paginate';
// import { FormattedMessage } from 'react-intl';


// function Items({ currentItems }) {
//       return (
//             <div className="items">
//                   {currentItems && currentItems.map((item) => (
//                         <div>
//                               <h3>Item #{item}</h3>
//                         </div>
//                   ))}
//             </div>
//       );
// }



// class PaginatedItems extends Component {

//       constructor(prop) {
//             super(prop);
//             this.state = {
//                   itemsPerPage :  [...Array(33).keys()],
//                   currentPage: 1,
//                   todosPerPage: 3
//             };
//             this.handleClick = this.handleClick.bind(this);
         

//       }

//       handleClick(event) {
//             this.setState({
//                   currentPage: Number(event.target.id)
//             });
//       }



//       componentDidMount() {

//       }



//       async componentDidUpdate(prevProps, prevState, snapchot) {
//             if (prevProps.language !== this.props.language) {

//             }

//             // if (prevProps.doctorIdParent !== this.props.doctorIdParent) {
//             //     let allDays = this.getDaySchedule(this.props.language);
//             //     let res = await getBookingModalByDateService(this.props.doctorIdParent, allDays[0].value);
//             //     this.setState({
//             //         allTimes: res.data ? res.data : [],

//             //     })
//             // }

//       }



     
      


//       render() {
//            let {itemsPerPage} = this.state
//             // We start with an empty list of items.
//             const [currentItems, setCurrentItems] = useState(null);
//             const [pageCount, setPageCount] = useState(0);
//             // Here we use item offsets; we could also use page offsets
//             // following the API or data you're working with.
//             const [itemOffset, setItemOffset] = useState(0);

//             useEffect(() => {
//                   // Fetch items from another resources.
//                   const endOffset = itemOffset + itemsPerPage;
//                   console.log(`Loading items from ${itemOffset} to ${endOffset}`);
//                   setCurrentItems(items.slice(itemOffset, endOffset));
//                   setPageCount(Math.ceil(items.length / itemsPerPage));
//             }, [itemOffset, itemsPerPage]);

//             // Invoke when user click to request another page.
//             const handlePageClick = (event) => {
//                   const newOffset = event.selected * itemsPerPage % items.length;
//                   console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
//                   setItemOffset(newOffset);
//             };


//             return (
//                   <>
//                         <Items currentItems={currentItems} />
//                         <ReactPaginate
//                               nextLabel="next >"
//                               onPageChange={handlePageClick}
//                               pageRangeDisplayed={3}
//                               marginPagesDisplayed={2}
//                               pageCount={pageCount}
//                               previousLabel="< previous"
//                               pageClassName="page-item"
//                               pageLinkClassName="page-link"
//                               previousClassName="page-item"
//                               previousLinkClassName="page-link"
//                               nextClassName="page-item"
//                               nextLinkClassName="page-link"
//                               breakLabel="..."
//                               breakClassName="page-item"
//                               breakLinkClassName="page-link"
//                               containerClassName="pagination"
//                               activeClassName="active"
//                               renderOnZeroPageCount={null}
//                         />
//                   </>
//             );
//       }

// }

// const mapStateToProps = state => {
//       return {

//             language: state.app.language,
//       };
// };

// const mapDispatchToProps = dispatch => {
//       return {


//       };
// };

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PaginatedItems));
