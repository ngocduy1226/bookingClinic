import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
class ProductManage extends Component {

   constructor(prop) {
       super(prop);
       this.state = {

       }
   }

    componentDidMount() {
    }


    render() {
        return (
            <div className="user-redux" >
                <div className='title'>MANAGE USER USING REDUX</div>

            </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductManage);
