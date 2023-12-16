import styled from 'styled-components'

export const RegisterPageLayout = styled.div`
  display: flex;
  justify-content: center;
  padding: 15px;
`

export const RegisterPageContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  a {
    width: 100%;

    @media (min-width: 768px) {
      width: 100%;
    }
  }

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
`

export const RegisterPageOption = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  padding: 20px;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.base_subtitle};
  border-radius: 8px;
  box-shadow: 0px 0px 10px ${(props) => props.theme.base_hover};
  transition: 0.2s;
  cursor: pointer;

  &:hover {
    box-shadow: 0px 0px 10px ${(props) => props.theme.base_label};
  }

  h1 {
    width: 50%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 1.8rem;
    font-family: 'Inter', sans-serif;

    .icon {
      color: ${(props) => props.theme.blue_dark};
    }
  }

  @media (min-width: 768px) {
    width: 100%;
    gap: 0;
  }
`
