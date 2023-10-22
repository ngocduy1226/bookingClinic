import React, { Component } from 'react';
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
