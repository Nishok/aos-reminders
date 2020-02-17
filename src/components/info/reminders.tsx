import React, { useMemo, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { without } from 'lodash'
import { useAppStatus } from 'context/useAppStatus'
import { visibility, selectors } from 'ducks'
import { componentWithSize } from 'utils/mapSizesToProps'
import { processReminders } from 'utils/processReminders'
import { getVisibleReminders } from 'utils/reminderUtils'
import { titleCase } from 'utils/textUtils'
import { Reminder } from 'components/info/reminder'
import { IArmy, TAllyArmies, ICurrentArmy } from 'types/army'
import { IStore } from 'types/store'
import { reminders } from 'ducks/reminders'
import { IReminder } from 'types/data'

// if (process.env.NODE_ENV === 'development') {
//   const whyDidYouRender = require('@welldone-software/why-did-you-render')
//   whyDidYouRender(React)
// }

const RemindersList: React.FC<{ reminders: IReminder; isMobile: boolean }> = ({ reminders, isMobile }) => {
  const whens = Object.keys(reminders)
  return (
    <>
      {whens.map((when, i) => {
        return (
          <Reminder isMobile={isMobile} when={when} actions={reminders[when]} key={`${when}_${i}`} idx={i} />
        )
      })}
    </>
  )
}

interface IRemindersProps extends ICurrentArmy {
  allyArmies: TAllyArmies
  army: IArmy
  hiddenReminders: string[]
  hideWhens: (values: string[]) => void
  isMobile: boolean
  setReminders: (reminders: IReminder) => void
  showWhen: (value: string) => void
  visibleWhens: string[]
}

const RemindersComponent = (props: IRemindersProps) => {
  const {
    allyArmies,
    army,
    hiddenReminders,
    hideWhens,
    isMobile,
    showWhen,
    setReminders,
    visibleWhens,
    ...currentArmy
  } = props

  const { isGameMode } = useAppStatus()

  let reminders = useMemo(() => {
    return processReminders(
      army,
      currentArmy.factionName,
      currentArmy.selections,
      currentArmy.realmscape_feature,
      currentArmy.allyFactionNames,
      allyArmies,
      currentArmy.allySelections
    )
  }, [army, allyArmies, currentArmy])

  if (isGameMode) reminders = getVisibleReminders(reminders, hiddenReminders)

  useEffect(() => {
    setReminders(reminders)
    console.log('hello?', reminders)
  }, [reminders, setReminders])

  const whens = useMemo(() => Object.keys(reminders), [reminders])
  const titles = useMemo(() => whens.map(titleCase), [whens])

  const [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    setFirstLoad(true)
  }, [currentArmy.factionName])

  useEffect(() => {
    // Remove orphaned phases
    // (phases where the rules have been removed via army_builder)
    const orphans = without(visibleWhens, ...titles)
    if (orphans.length) hideWhens(orphans)

    // If we're on mobile AND it's our first load of a new army AND
    // we have no phases displayed AND there are phases that could be displayed
    if (isMobile && firstLoad && !visibleWhens.length && titles.length) {
      setFirstLoad(false)
      showWhen(titles[0]) // Show the first phase
    }
  }, [isGameMode, isMobile, firstLoad, visibleWhens, titles, showWhen, hideWhens])

  return (
    <div className={`row mx-auto ${isGameMode ? `mt-0` : `mt-3`} d-flex justify-content-center`}>
      <div className="col col-sm-11 col-md-10 col-lg-10 col-xl-8 ReminderContainer">
        <RemindersList reminders={reminders} isMobile={isMobile} />
        {/* {whens.map((when, i) => {
          return (
            <Reminder
              isMobile={isMobile}
              when={when}
              actions={reminders[when]}
              key={`${when}_${i}`}
              idx={i}
            />
          )
        })} */}
      </div>
    </div>
  )
}

// RemindersComponent.whyDidYouRender = true

const mapStateToProps = (state: IStore, ownProps) => ({
  ...ownProps,
  ...selectors.getCurrentArmy(state),
  allyArmies: selectors.getAllyArmies(state),
  army: selectors.getArmy(state),
  hiddenReminders: selectors.getReminders(state),
  visibleWhens: selectors.getWhen(state),
})

const mapDispatchToProps = {
  hideWhens: visibility.actions.deleteWhens,
  setReminders: reminders.actions.setReminders,
  showWhen: visibility.actions.addWhen,
}

const Reminders = connect(mapStateToProps, mapDispatchToProps)(componentWithSize(RemindersComponent))

export default Reminders
