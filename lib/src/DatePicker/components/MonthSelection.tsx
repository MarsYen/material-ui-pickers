import * as React from 'react';
import Month from './Month';
import { ParsableDate } from '../../constants/prop-types';
import { MaterialUiPickersDate } from '../../typings/date';
import { withUtils, WithUtilsProps } from '../../_shared/WithUtils';
import { createStyles, WithStyles, withStyles } from '@material-ui/styles';

export interface MonthSelectionProps extends WithUtilsProps, WithStyles<typeof styles> {
  date: MaterialUiPickersDate;
  minDate?: ParsableDate;
  maxDate?: ParsableDate;
  onChange: (date: MaterialUiPickersDate) => void;
  disablePast?: boolean | null | undefined;
  disableFuture?: boolean | null | undefined;
}

export class MonthSelection extends React.PureComponent<MonthSelectionProps> {
  public static defaultProps = {
    minDate: new Date('1900-01-01'),
    maxDate: new Date('2100-01-01'),
  };

  public onMonthSelect = (month: number) => {
    const { date, onChange, utils } = this.props;

    const newDate = utils.setMonth(date, month);
    onChange(newDate);
  };

  public shouldDisableMonth = (month: MaterialUiPickersDate) => {
    const { utils, disablePast, disableFuture, minDate, maxDate } = this.props;
    const now = utils.date();
    const utilMinDate = utils.date(minDate);
    const utilMaxDate = utils.date(maxDate);

    const firstEnabledMonth = utils.startOfMonth(
      disablePast && utils.isAfter(now, utilMinDate) ? now : utilMinDate
    );

    const lastEnabledMonth = utils.startOfMonth(
      disableFuture && utils.isBefore(now, utilMaxDate) ? now : utilMaxDate
    );

    const isBeforeFirstEnabled = utils.isBefore(month, firstEnabledMonth);
    const isAfterLastEnabled = utils.isAfter(month, lastEnabledMonth);

    return isBeforeFirstEnabled || isAfterLastEnabled;
  };

  public render() {
    const { date, classes, utils } = this.props;
    const currentMonth = utils.getMonth(date);

    return (
      <div className={classes.container}>
        {utils.getMonthArray(date).map(month => {
          const monthNumber = utils.getMonth(month);
          const monthText = utils.format(month, 'MMM');

          return (
            <Month
              key={monthText}
              value={monthNumber}
              selected={monthNumber === currentMonth}
              onSelect={this.onMonthSelect}
              disabled={this.shouldDisableMonth(month)}
            >
              {monthText}
            </Month>
          );
        })}
      </div>
    );
  }
}

export const styles = createStyles({
  container: {
    width: 310,
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'stretch',
  },
});

export default withStyles(styles, { name: 'MuiPickersMonthSelection' })(
  withUtils()(MonthSelection)
);
