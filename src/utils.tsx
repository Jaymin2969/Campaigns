import { format, addDays } from 'date-fns';
import { Campaign, Schedule } from "./types";

// Array representing the days of the week
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Function to get the message for the next event
const getNextEventMessage = (currentDay: string, campaign: Campaign) => {
    // Find the index of the current day
    const currentIndex = daysOfWeek.indexOf(currentDay);
    let nextIndex = (currentIndex + 1) % 7;

    // Find the next day that has a scheduled event
    while (!campaign.schedule.some(schedule => schedule.weekdays.includes(daysOfWeek[nextIndex]))) {
        nextIndex = (nextIndex + 1) % 7;
    }

    // Get the next day and its schedules
    const nextDay = daysOfWeek[nextIndex];
    const nextSchedules = campaign.schedule.filter(schedule => schedule.weekdays.includes(nextDay));

    // If there are schedules on the next day
    if (nextSchedules.length) {
        // Sort the schedules by start time
        nextSchedules.sort((a, b) => a.startTime.localeCompare(b.startTime));
        const nextSchedule = nextSchedules[0];

        // Calculate the date and time of the next event
        const now = new Date();
        const daysUntilNext = (nextIndex - currentIndex + 7) % 7;
        const nextEventDate = addDays(now, daysUntilNext);
        const nextStartDateTime = new Date(`${format(nextEventDate, 'yyyy-MM-dd')}T${nextSchedule.startTime}`);
        const nextEndDateTime = new Date(`${format(nextEventDate, 'yyyy-MM-dd')}T${nextSchedule.endTime}`);

        // Return the formatted message for the next event
        return `The next event is on ${format(nextStartDateTime, 'EEEE, MMMM d, yyyy')} from ${format(nextStartDateTime, 'h:mm a')} to ${format(nextEndDateTime, 'h:mm a')}.`;
    }
    return '';
};

// Main function to get the campaign activation status
export const getCampaignActivation = (schedules: Schedule[], campaign: Campaign, currentDate: Date = new Date()) => {
    // Parse and format the campaign start and end dates
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);
    const formattedStartDate = format(startDate, "yyyy-MM-dd");
    const formattedEndDate = format(endDate, "yyyy-MM-dd");
    const formattedCurrentDate = format(currentDate, "yyyy-MM-dd");

    // Check if the campaign has started
    if (formattedCurrentDate < formattedStartDate) {
        return 'The campaign has not started yet.';
    }

    // Check if the campaign has ended
    if (formattedCurrentDate > formattedEndDate) {
        return 'The campaign has ended.';
    }

    // Get the current day of the week
    const currentDay = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

    // Filter schedules for the current day
    const currentSchedules = campaign.schedule.filter(schedule =>
        schedule.weekdays.includes(currentDay)
    );

    // If there are schedules for the current day
    if (currentSchedules.length) {
        // Sort the schedules by start time
        currentSchedules.sort((a, b) => a.startTime.localeCompare(b.startTime));
        const currentSchedule = currentSchedules[0];

        // Calculate the start and end times for the current schedule
        const startDateTime = new Date(`${format(currentDate, 'yyyy-MM-dd')}T${currentSchedule.startTime}`);
        const endDateTime = new Date(`${format(currentDate, 'yyyy-MM-dd')}T${currentSchedule.endTime}`);

        // Check if the event is yet to start, live, or has ended
        if (currentDate < startDateTime) {
            return `The event will start at ${format(startDateTime, 'h:mm a')} today and end at ${format(endDateTime, 'h:mm a')}.`;
        } else if (currentDate >= startDateTime && currentDate <= endDateTime) {
            return 'The event is live now.';
        } else if (currentDate > endDateTime) {
            return getNextEventMessage(currentDay, campaign);
        }
    } else {
        // If there are no schedules for the current day, get the next event message
        return getNextEventMessage(currentDay, campaign);
    }
};
