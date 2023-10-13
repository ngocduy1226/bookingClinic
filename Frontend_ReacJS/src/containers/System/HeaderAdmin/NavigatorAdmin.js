import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import './NavigatorAdmin.scss';

class MenuGroup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowNavData: false,
        }
    }


    isShowNavLink = () => {
        this.setState({
            isShowNavData: !this.state.isShowNavData,
        })


    }

    render() {
        const { name, children } = this.props;
       
        let { isShowNavData } = this.state;
        return (
            <li className=" nav-item menu-open mx-3">
                <div className="nav-link "
                // active
                    style={{ justifyContent: 'space-between' }}
                    onClick={() => this.isShowNavLink()}
                >
                    <span className='d-flex'>
                        <i class="nav-icon fas fa-tachometer-alt m-1"></i>
                        <div className='mx-2'>
                            <FormattedMessage id={name} />

                        </div >
                    </span>
                    <span >
                        <i class={isShowNavData === true ? "fas fa-angle-down" : "right fas fa-angle-left"} ></i>
                    </span>

                </div>
                {
                    isShowNavData === true &&

                    <ul className=" nav nav-treeview">
                        {children}
                    </ul>
                }

            </li>
        );
    }
}

class Menu extends Component {

    render() {
        const { name, active,  link, children, onClick, hasSubMenu, onLinkClick } = this.props;
        return (
            <li className={"nav-item" + (hasSubMenu ? " has-sub-menu" : "") + ("") + (active ? " active" : "")}>
                {hasSubMenu ? (
                    <Fragment>
                        <span
                            data-toggle="collapse"
                            className={" nav-link"}
                            onClick={onClick}
                            aria-expanded={"false"}
                        >
                            <FormattedMessage id={name} />

                        </span>
                        <div>
                            <ul className="sub-menu-list list-unstyled nav nav-treeview">
                                {children}
                            </ul>
                        </div>
                    </Fragment>
                ) : (
                    <Link to={link} className="nav-link" onClick={onLinkClick}>
                        <div className="icon-right mx-2">
                            <i class="far fa-circle nav-icon"></i>
                        </div>
                        <FormattedMessage id={name} />

                    </Link>
                )}
            </li>
        );
    }
}

class SubMenu extends Component {

    getItemClass = path => {
        return this.props.location.pathname === path ? "active" : "";
    };

    render() {
        const { name, link, onLinkClick } = this.props;
        return (
            <li className={"sub-menu " + this.getItemClass(link)}>
                <Link to={link} className="sub-menu-link" onClick={onLinkClick}>
                    <FormattedMessage id={name} />
                </Link>
            </li>
        );
    }
}

const MenuGroupWithRouter = withRouter(MenuGroup);
const MenuWithRouter = withRouter(Menu);
const SubMenuWithRouter = withRouter(SubMenu);

const withRouterInnerRef = (WrappedComponent) => {

    class InnerComponentWithRef extends React.Component {
        render() {
            const { forwardRef, ...rest } = this.props;
            return <WrappedComponent {...rest} ref={forwardRef} />;
        }
    }

    const ComponentWithRef = withRouter(InnerComponentWithRef, { withRef: true });

    return React.forwardRef((props, ref) => {
        return <ComponentWithRef {...props} forwardRef={ref} />;
    });
};

class NavigatorAdmin extends Component {
    state = {
        expandedMenu: {}
    };

    toggle = (groupIndex, menuIndex) => {
        const expandedMenu = {};
        const needExpand = !(this.state.expandedMenu[groupIndex + '_' + menuIndex] === true);
        if (needExpand) {
            expandedMenu[groupIndex + '_' + menuIndex] = true;
        }

        this.setState({
            expandedMenu: expandedMenu
        });
    };

    isMenuHasSubMenuActive = (location, subMenus, link) => {
        if (subMenus) {
            if (subMenus.length === 0) {
                return false;
            }

            const currentPath = location.pathname;
            for (let i = 0; i < subMenus.length; i++) {
                const subMenu = subMenus[i];
                if (subMenu.link === currentPath) {
                    return true;
                }
            }
        }

        if (link) {
            return this.props.location.pathname === link;
        }

        return false;
    };

    checkActiveMenu = () => {
        const { menus, location } = this.props;
        outerLoop:
        for (let i = 0; i < menus.length; i++) {
            const group = menus[i];
            if (group.menus && group.menus.length > 0) {
                for (let j = 0; j < group.menus.length; j++) {
                    const menu = group.menus[j];
                    if (menu.subMenus && menu.subMenus.length > 0) {
                        if (this.isMenuHasSubMenuActive(location, menu.subMenus, null)) {
                            const key = i + '_' + j;
                            this.setState({
                                expandedMenu: {
                                    [key]: true
                                }
                            });
                            break outerLoop;
                        }
                    }
                }
            }
        }
    };

    componentDidMount() {
        this.checkActiveMenu();
    };

    // componentWillReceiveProps(nextProps, prevState) {
    //     const { location, setAccountMenuPath, setSettingMenuPath } = this.props;
    //     const { location: nextLocation } = nextProps;
    //     if (location !== nextLocation) {
    //         let pathname = nextLocation && nextLocation.pathname;
    //         if ((pathname.startsWith('/account/') || pathname.startsWith('/fds/account/'))) {
    //             setAccountMenuPath(pathname);
    //         }
    //         if (pathname.startsWith('/settings/')) {
    //             setSettingMenuPath(pathname);
    //         };
    //     };
    // };

    componentDidUpdate(prevProps, prevState) {
        const { location } = this.props;
        const { location: prevLocation } = prevProps;
        if (location !== prevLocation) {
            this.checkActiveMenu();
        };
    };

    render() {
        const { menus, location, onLinkClick } = this.props;
        return (
            <Fragment>
                <ul className=" nav nav-pills nav-sidebar flex-column">
                    {
                        menus.map((group, groupIndex) => {
                            
                            return (
                                <Fragment key={groupIndex}>
                                    <MenuGroupWithRouter
                                        name={group.name}
                                    

                                    >
                                        {group.menus ? (
                                            group.menus.map((menu, menuIndex) => {
                                                const isMenuHasSubMenuActive = this.isMenuHasSubMenuActive(location, menu.subMenus, menu.link);
                                                const isSubMenuOpen = this.state.expandedMenu[groupIndex + '_' + menuIndex] === true;
                                                return (
                                                    <MenuWithRouter
                                                        key={menuIndex}
                                                        active={isMenuHasSubMenuActive}
                                                     
                                                        name={menu.name}
                                                        link={menu.link}
                                                        hasSubMenu={menu.subMenus}
                                                        isOpen={isSubMenuOpen}
                                                        onClick={() => this.toggle(groupIndex, menuIndex)}
                                                        onLinkClick={onLinkClick}
                                                    >
                                                        {menu.subMenus && menu.subMenus.map((subMenu, subMenuIndex) => (
                                                            <SubMenuWithRouter
                                                                key={subMenuIndex}
                                                                name={subMenu.name}
                                                                link={subMenu.link}
                                                                onClick={this.closeOtherExpand}
                                                                onLinkClick={onLinkClick}
                                                            />
                                                        ))}
                                                    </MenuWithRouter>
                                                );
                                            })
                                        ) : null}
                                    </MenuGroupWithRouter>
                                </Fragment>
                            );
                        })
                    }
                </ul>
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    }
}

export default withRouterInnerRef(connect(mapStateToProps, mapDispatchToProps)(NavigatorAdmin));





