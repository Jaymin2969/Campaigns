import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {addCampaign, updateCampaign} from '../../redux/campaignsSlice';
import {CampaignType, Schedule, Campaign} from '../../types';
import {RootState} from '../../redux/store';
import {
    Button,
    TextField,
    Select,
    MenuItem,
    FormHelperText,
    FormControl,
    SelectChangeEvent,
    InputLabel
} from '@mui/material';
import styles from './style.module.css';

interface CampaignFormProps {
    campaignId?: string; // Optional campaign ID for editing existing campaigns
    onClose: () => void; // Function to close the form
}

const CampaignForm: React.FC<CampaignFormProps> = ({campaignId, onClose}) => {
    const dispatch = useDispatch();
    const campaignToEdit = useSelector((state: RootState) =>
        state.campaigns.campaigns.find(c => c.id === campaignId)
    );

    // State variables for form fields and errors
    const [type, setType] = useState<CampaignType>('Cost per Order');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [weekday, setWeekday] = useState<string>('Monday');
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');

    // State variables for validation error messages
    const [typeError, setTypeError] = useState<string>('');
    const [startDateError, setStartDateError] = useState<string>('');
    const [endDateError, setEndDateError] = useState<string>('');
    const [scheduleError, setScheduleError] = useState<string>('');

    // Load data from redux store when editing an existing campaign
    useEffect(() => {
        if (campaignToEdit) {
            setType(campaignToEdit.type);
            setStartDate(campaignToEdit.startDate);
            setEndDate(campaignToEdit.endDate);
            setSchedules(campaignToEdit.schedule);
        }
    }, [campaignToEdit]);

    // Reset form fields and error messages
    const resetForm = () => {
        setType('Cost per Order');
        setStartDate('');
        setEndDate('');
        setSchedules([]);
        setWeekday('Monday');
        setStartTime('');
        setEndTime('');

        setTypeError('');
        setStartDateError('');
        setEndDateError('');
        setScheduleError('');
    };

    // Add schedule to the list
    const handleAddSchedule = () => {
        if (weekday && startTime && endTime) {
            if (startTime >= endTime) {
                setScheduleError('Start time must be before end time');
                return;
            }

            setSchedules([...schedules, {weekdays: [weekday], startTime, endTime}]);
            setWeekday('Monday');
            setStartTime('');
            setEndTime('');
            setScheduleError('');
        }
    };

    // Validate form fields before saving
    const validateForm = () => {
        let isValid = true;

        if (!type) {
            setTypeError('Campaign type is required');
            isValid = false;
        } else {
            setTypeError('');
        }

        const currentDate = new Date().toISOString().split('T')[0];
        if (!startDate) {
            setStartDateError('Start date is required');
            isValid = false;
        } else if (startDate < currentDate) {
            setStartDateError('Start date cannot be earlier than today');
            isValid = false;
        } else {
            setStartDateError('');
        }

        if (!endDate) {
            setEndDateError('End date is required');
            isValid = false;
        } else if (new Date(startDate) > new Date(endDate)) {
            setEndDateError('End date must be after start date');
            isValid = false;
        } else {
            setEndDateError('');
        }

        if (schedules.length === 0) {
            setScheduleError('At least one schedule is required');
            isValid = false;
        } else {
            setScheduleError('');
        }

        return isValid;
    };

    // Save campaign data
    const handleSaveCampaign = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const newCampaign: Campaign = {
            id: campaignId || Math.random().toString(36).substr(2, 9),
            type,
            startDate,
            endDate,
            schedule: schedules,
        };

        if (campaignId) {
            dispatch(updateCampaign(newCampaign));
        } else {
            dispatch(addCampaign(newCampaign));
        }

        resetForm();
        onClose();
    };

    // Cancel editing or adding campaign
    const handleCancel = () => {
        resetForm();
        onClose();
    };

    return (
        <div className={styles.root}>
            <h1>{campaignId ? 'Edit Campaign' : 'Create Campaign'}</h1>
            <form onSubmit={handleSaveCampaign} className={styles.form}>
                {/* Campaign Type Selector */}
                <div className={styles.campaignTypeWrapper}>
                    <FormControl error={Boolean(typeError)}>
                        <InputLabel id="select-the-type-label">Campaign Type</InputLabel>
                        <Select
                            value={type}
                            onChange={(e: SelectChangeEvent) => setType(e.target.value as CampaignType)}
                            label="Campaign Type"
                            labelId="select-the-type-label"
                        >
                            <MenuItem value="Cost per Order">Cost per Order</MenuItem>
                            <MenuItem value="Cost per Click">Cost per Click</MenuItem>
                            <MenuItem value="Buy One Get One">Buy One Get One</MenuItem>
                        </Select>
                        {typeError && <FormHelperText>{typeError}</FormHelperText>}
                    </FormControl>
                </div>

                {/* Date Picker */}
                <div className={styles.dateWrapper}>
                    <FormControl error={Boolean(startDateError)}>
                        <TextField
                            label="Start Date"
                            type="date"
                            value={startDate}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        {startDateError && <FormHelperText>{startDateError}</FormHelperText>}
                    </FormControl>
                    <FormControl error={Boolean(endDateError)}>
                        <TextField
                            label="End Date"
                            type="date"
                            value={endDate}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        {endDateError && <FormHelperText>{endDateError}</FormHelperText>}
                    </FormControl>
                </div>

                {/* Schedule Selector and Time Pickers */}
                <div className={styles.scheduleTimeContainer}>
                    <h3>Schedule</h3>
                    <div className={styles.scheduleTimeWrapper}>
                        <div className={styles.scheduleTime}>
                            <FormControl>
                                <InputLabel id="select-the-day-label">Select the Day</InputLabel>
                                <Select
                                    value={weekday}
                                    onChange={(e: SelectChangeEvent) => setWeekday(e.target.value)}
                                    label="Select the Day"
                                    labelId="select-the-day-label"
                                >
                                    <MenuItem value="Monday">Monday</MenuItem>
                                    <MenuItem value="Tuesday">Tuesday</MenuItem>
                                    <MenuItem value="Wednesday">Wednesday</MenuItem>
                                    <MenuItem value="Thursday">Thursday</MenuItem>
                                    <MenuItem value="Friday">Friday</MenuItem>
                                    <MenuItem value="Saturday">Saturday</MenuItem>
                                    <MenuItem value="Sunday">Sunday</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl>
                                <TextField
                                    label="Start Time"
                                    type="time"
                                    value={startTime}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        step: 300, // 5 min
                                    }}
                                />
                            </FormControl>
                            <FormControl>
                                <TextField
                                    label="End Time"
                                    type="time"
                                    value={endTime}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndTime(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        step: 300, // 5 min
                                    }}
                                />
                            </FormControl>
                        </div>

                        <Button onClick={handleAddSchedule}>Add Schedule</Button>
                    </div>
                    {schedules.map((schedule, index) => (
                        <div key={index}>
                            {schedule.weekdays.join(', ')}: {schedule.startTime} - {schedule.endTime}
                        </div>
                    ))}
                    {scheduleError && <div className={styles.error}>{scheduleError}</div>}
                </div>

                {/* Submit and Cancel Buttons */}
                <Button type="submit" variant="contained">
                    {campaignId ? 'Update Campaign' : 'Add Campaign'}
                </Button>
                <Button onClick={handleCancel} variant="outlined">
                    Cancel
                </Button>
            </form>
        </div>
    );
};

export default CampaignForm;
