import React, {useState, useEffect, ChangeEvent} from 'react';
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
    campaignId?: string;
    onClose: () => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({campaignId, onClose}) => {
    const dispatch = useDispatch();
    const campaignToEdit = useSelector((state: RootState) =>
        state.campaigns.campaigns.find(c => c.id === campaignId)
    );

    const [type, setType] = useState<CampaignType>('Cost per Order');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [weekday, setWeekday] = useState<string>('Monday');
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');

    const [typeError, setTypeError] = useState<string>('');
    const [startDateError, setStartDateError] = useState<string>('');
    const [endDateError, setEndDateError] = useState<string>('');
    const [scheduleError, setScheduleError] = useState<string>('');

    useEffect(() => {
        if (campaignToEdit) {
            setType(campaignToEdit.type);
            setStartDate(campaignToEdit.startDate);
            setEndDate(campaignToEdit.endDate);
            setSchedules(campaignToEdit.schedule);
        }
    }, [campaignToEdit]);

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

    const handleAddSchedule = () => {
        if (weekday && startTime && endTime) {
            setSchedules([...schedules, {weekdays: [weekday], startTime, endTime}]);
            setWeekday('');
            setStartTime('');
            setEndTime('');
        }
    };

    const validateForm = () => {
        let isValid = true;

        if (!type) {
            setTypeError('Campaign type is required');
            isValid = false;
        } else {
            setTypeError('');
        }

        if (!startDate) {
            setStartDateError('Start date is required');
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

    const handleSaveCampaign = (e: any) => {
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

    const handleCancel = () => {
        resetForm();
        onClose();
    };

    return (
        <div className={styles.root}>
            <h1>{campaignId ? 'Edit Campaign' : 'Create Campaign'}</h1>
            <form onSubmit={handleSaveCampaign} className={styles.form}>
                <div className={styles.campaignTypeWrapper}>
                    <FormControl error={Boolean(typeError)}>
                        <InputLabel id="select-the-day-lable">select the day</InputLabel>

                        <Select value={type}
                                label="select the type"
                                labelId="select-the-type-lable"

                                onChange={(e: SelectChangeEvent<string>) => setType(e.target.value as CampaignType)}>
                            <MenuItem value="Cost per Order">Cost per Order</MenuItem>
                            <MenuItem value="Cost per Click">Cost per Click</MenuItem>
                            <MenuItem value="Buy One Get One">Buy One Get One</MenuItem>
                        </Select>
                        {typeError && <FormHelperText>{typeError}</FormHelperText>}
                    </FormControl>
                </div>
                <div className={styles.dateWrapper}>
                    <FormControl error={Boolean(startDateError)}>
                        <div>
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
                        </div>
                    </FormControl>
                    <FormControl error={Boolean(endDateError)}>
                        <div>
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
                        </div>
                    </FormControl>
                </div>

                <div className={styles.scheduleTimeContainer}>
                    <h3>Schedule</h3>
                    <div className={styles.scheduleTimeWrapper}>
                        <div className={styles.scheduleTime}>
                            <FormControl>
                                <InputLabel id="select-the-day-lable">select the day</InputLabel>

                                <Select value={weekday} label="select the day"
                                        labelId="select-the-day-lable"
                                        defaultValue='Monday'

                                        onChange={(e: SelectChangeEvent<string>) => setWeekday(e.target.value)}
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
                <Button type="submit" variant="contained">{campaignId ? 'Update Campaign' : 'Add Campaign'}</Button>
            </form>
            <Button onClick={handleCancel} variant="outlined">Cancel</Button>
        </div>
    );
};

export default CampaignForm;
