// @flow

import * as React from 'react'
import styled from 'styled-components'
import LastUpdateInfo from '../../../modules/common/components/LastUpdateInfo'

const StyledBanner = styled.div`
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 700;
  margin: 25px 0;
  height: 60px;
  background-color: rgba(239, 210, 43, 0.4);
  border-radius: 11px;
  overflow: hidden;
  position: relative;
`

const StyledText = styled.div`
  display: flex;
  align-items: center;
  background-color: #efd22b;
  color: white;
  width: auto;
  height: 100%;
  padding: 0 10px;
`

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #6f6f6e;
  margin-bottom: 5px;
`
const Content = styled.p`
  font-size: 16px;
  line-height: 1.38;
  color: #6f6f6e;
`

type PropsType = {|
  title: string,
  message: string,
  timestamp: any
|}

// This just a placeholder until the page design is ready
class PushNewsDetails extends React.PureComponent<PropsType> {
  render () {
    const { title, message, timestamp, language = 'de' } = this.props
    return (
      <div
        style={{
          maxWidth: 660
        }}
        >
        <StyledBanner>
          <StyledText>
            LOCAL NEWS
          </StyledText>
        </StyledBanner>

        <Title>{title}</Title>
        <Content>{message}</Content>
        <LastUpdateInfo lastUpdate={timestamp} language={language} />
      </div>
    )
  }
}

export default PushNewsDetails
