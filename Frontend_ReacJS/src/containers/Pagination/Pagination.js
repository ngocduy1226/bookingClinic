import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import './Pagination.scss'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../utils";
import * as actions from "../../store/actions";
import { get } from 'lodash';
import { withRouter } from "react-router";
import moment from 'moment';
import localization from 'moment/locale/vi';

import { FormattedMessage } from 'react-intl';



class Pagination extends Component {


    constructor(prop) {
        super(prop);
        this.state = {
         numbers: [],
         currentPage: 1,
         nPages: 1,
        };
    }

    componentDidMount() {
      this.setState({
        numbers: this.props.numbers,
        currentPage: this.props.currentPage,
        nPages: this.props.nPages,

     })
    }
     
    async componentDidUpdate(prevProps, prevState, snapchot) {
        if (prevProps.language !== this.props.language) {
             
        }

        if (prevProps.numbers !== this.props.numbers) {
            this.setState({
               numbers: this.props.numbers,

            })
          
        }

        if (prevProps.currentPage !== this.props.currentPage) {
            this.setState({
               currentPage: this.props.currentPage,

            })
            
        }

        if (prevProps.nPages !== this.props.nPages) {
            this.setState({
               nPages: this.props.nPages,

            })
           
        }
        
    }
     

    nextPage = () => {
      if (this.state.currentPage !== this.state.nPages) {
        this.setState({
          currentPage: this.state.currentPage + 1,
        })
        this.props.getRecordParent(this.state.currentPage + 1);
      }
      
  
    }
    // n = npage
    prePage = () => {
      if (this.state.currentPage !== 1) {
        this.setState({
          currentPage: this.state.currentPage - 1,
        })
        this.props.getRecordParent(this.state.currentPage - 1);
      }
     
    }
  
    changeCPage = (n) => {
      this.setState({
        currentPage: n,
      })
      this.props.getRecordParent(n);
    }
    
    render() {
        
        let {numbers, currentPage} = this.state;

        console.log('state con', this.state);
        return (
            <>
            <nav className='pagination-container' >
              <ul className="pagination">
                <li className="page-item" onClick={() => this.prePage()}>
                  <a href="#" clasName='page-link ' >
                    Prev </a>
                </li>
                {numbers.map((n, i) => {
                  return (
                    <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={i} onClick={() => this.changeCPage(n)}>
                      <a href="#" clasName='page-link ' >
                        {n}
                      </a>
                    </li>
                  );

                })}

                <li className="page-item" onClick={() => this.nextPage()} >
                  <a href="#" clasName='page-link' >
                    Next
                  </a>
                </li>
              </ul>

            </nav>
            </>
        );
    }

}

const mapStateToProps = state => {
    return {

        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {


    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Pagination));
