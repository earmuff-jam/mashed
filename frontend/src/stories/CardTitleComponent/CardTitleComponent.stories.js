import { store } from '../../Store';
import { Provider } from 'react-redux';
import { primary_theme } from '../../util/Theme';
import { ThemeProvider } from '@material-ui/core';
import CardTitleComponent from './CardTitleComponent';
import { withRouter } from 'storybook-addon-react-router-v6';
import { CardMembershipRounded, GroupRounded } from '@material-ui/icons';

export default {
  title: 'CardTitleComponent/CardTitleComponent',
  component: CardTitleComponent,
  decorators: [
    withRouter,
    (Story) => (
      <Provider store={store}>
        <ThemeProvider theme={primary_theme}>
          <Story />
        </ThemeProvider>
      </Provider>
    ),
  ],
};

export const PrimaryCardTitleComponentEventDetails = {
  args: {
    firstLabel: '12',
    firstIcon: <CardMembershipRounded />,
    firstToolTipLabel: 'Current members',
    secondIcon: <GroupRounded />,
    secondLabel: 22,
    secondTooltipLabel: 'Anticipated members',
    titleText: 'Fall and shelter rescue center',
    titleTooltip: 'Fall and shelter rescue center',
    extraSubtitle: 'A small community group that loves to recsue dogs.',
  },
};

export const PrimaryCardTitleComponentProfileDetails = {
  args: {
    firstLabel: 'johnny_cash',
    firstIcon: <CardMembershipRounded />,
    firstToolTipLabel: 'Current members',
    secondIcon: <GroupRounded />,
    secondLabel: 'phone number',
    secondTooltipLabel: 'Anticipated members',
    titleText: 'Arthur Morgan',
    titleTooltip: 'Username',
    extraSubtitle: 'Edit event details to add description',
  },
};

export const PrimaryCardTitleComponentProfileDetailsLongTitleText = {
  args: {
    firstLabel: 'johnny_cash',
    firstIcon: <CardMembershipRounded />,
    firstToolTipLabel: 'Current members',
    secondIcon: <GroupRounded />,
    secondLabel: 'phone number',
    secondTooltipLabel: 'Anticipated members',
    titleText: 'Arthur Morgan from Red Dead Redemtion 2',
    titleTooltip: 'Username',
    extraSubtitle: 'Displays how the ellipsis works for long profile names or event names',
  },
};
