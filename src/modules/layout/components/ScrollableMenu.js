import React from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft  } from '@fortawesome/free-solid-svg-icons'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import HeaderNavigationItem from './../../../modules//layout/components/HeaderNavigationItem'


const IconWrapper = styled.div`
${'' /* padding: 0 15px; */}
`
const ArrowLeft = <IconWrapper><FontAwesomeIcon icon={faChevronLeft} /></IconWrapper>

const ArrowRight = <IconWrapper><FontAwesomeIcon icon={faChevronRight} /></IconWrapper>

type PropsType = {|
  menuNavItems: Array<Element<typeof HeaderNavigationItem>>
|}

export const Menu = (menuNavItems) =>
  menuNavItems.map((el, index) => {
    const { text, href, selected, active, tooltip } = el;

    return <HeaderNavigationItem text={text} href={href} selected={selected} active={active} tooltip={tooltip} key={`menu-item-${index}`}/>
  });

class ScrollableMenu extends React.Component<PropsType> {
  state = {
    alignCenter: true,
    clickWhenDrag: false,
    dragging: true,
    hideArrows: true,
    hideSingleArrow: true,
    itemsCount: null,
    menuNavItems: null,
    scrollToSelected: false,
    selected: null,
    translate: 0,
    transition: 0.3,
    wheel: true
  };

  constructor(props) {
    super(props);
    this.menu = null;
    this.menuItems = props.menuNavItems && Menu(props.menuNavItems.slice(0, props.menuNavItems.length));
  }

  componentDidMount() {
    const currentlySelected = 'menu-item-' + _.findIndex(this.props.menuNavItems, ele => ele.selected)
    this.setState({selected: currentlySelected})
  }

  onUpdate = ({ translate }) => {
    console.log(`onUpdate: translate: ${translate}`);
    this.setState({ translate });
  };

  onSelect = (key) => {
    console.log('key-marker', key)
    this.setState({ selected: key })
  }

  render() {
    const {
      alignCenter,
      clickWhenDrag,
      hideArrows,
      dragging,
      hideSingleArrow,
      itemsCount,
      selected,
      transition,
      wheel
    } = this.state;

    const menu = this.menuItems

    return (
        <ScrollMenu
        alignCenter={alignCenter}
        arrowLeft={ArrowLeft}
        arrowRight={ArrowRight}
        clickWhenDrag={clickWhenDrag}
        data={menu}
        dragging={dragging}
        hideArrows={hideArrows}
        hideSingleArrow={hideSingleArrow}
        onUpdate={this.onUpdate}
        scrollToSelected={true}
        selected={selected}
        transition={+transition}
        translate={0.02}
        wheel
        alignCenter
        alignOnResize
        onSelect={this.onSelect}
        scrollBy={1}
        menuStyle={{
          width: '100%',
          minHeight: '100%',
        }}
        wrapperStyle={{
          width: '100%',
          minHeight: '100%',
          padding: '0 10px'
        }}
        innerWrapperStyle={{
          alignSelf: 'flex-start',
          display: 'flex',
          width: '100%',
        }}
        ref={el => console.log('marker',el)}
        />
    );
  }
}

export default ScrollableMenu;

