import React, { Component  ,  useEffect,
    useState} from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './MedicineManage.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import * as actions from "../../../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment, { relativeTimeThreshold } from 'moment';
import localization from 'moment/locale/vi';
import { createNewMedicineService, editMedicineService } from "../../../../services/medicineService"
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import ModalMedicine from './ModalMedicine';
import { emitter } from "../../../../utils/emitter";
import MedicineTable from './MedicineTable';

import ReactPaginate from 'react-paginate';
import TodoApp from '../../page'



const items = [...Array(33).keys()];

function Items({ currentItems }) {
  return (
    <div className="items">
    {currentItems && currentItems.map((item) => (
      <div>
        <h3>Item #{item}</h3>
      </div>
    ))}
      </div>
  );
}

function PaginatedItems({ itemsPerPage }) {
  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [itemOffset, itemsPerPage]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage % items.length;
    console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
    setItemOffset(newOffset);
  };

  return (
    <>
      <Items currentItems={currentItems} />
      <ReactPaginate
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
    </>
  );
}



class MedicineManage extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
    
       

        };
    }

    componentDidMount() {
    

    }

    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {

        }

        
    }

    render() {
       

        return (
            <div className='medicine-manage-container'>
                <div className='medicine-manage-title'>
                    <FormattedMessage id="manage-medicine.title" />
                </div>
                
                <div className='medicine-manage-content'>
                <div className='medicine-manage-title-sub'>
                    <FormattedMessage id="manage-medicine.title-sub" />
                    </div>
                    <div className='body-content'>
                      <MedicineTable 
                          isShowManageMedicineParent = {true}
                      />  
                    </div>
                    
                </div>


                {/* <PaginatedItems itemsPerPage={4} />,


                <TodoApp />, */}
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicineManage));
