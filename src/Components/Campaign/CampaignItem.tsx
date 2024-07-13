import React, {useState} from 'react';
import {Campaign} from '../../types';
import {getNextActivation} from '../../utils';
import {
    Card,
    CardContent,
    Typography,
    Button,
    CardActions,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar
} from '@mui/material';
import {useSpring, animated, config} from 'react-spring';
import {useDispatch} from 'react-redux';
import {deleteCampaign} from '../../redux/campaignsSlice';

// Interface defining the props for the CampaignItem component
interface CampaignItemProps {
    campaign: Campaign;
    handleEditCampaign: (campaignId?: string) => void;
}

// Functional component CampaignItem
const CampaignItem: React.FC<CampaignItemProps> = ({campaign, handleEditCampaign}) => {
    // Calculate the next activation time using the getNextActivation utility function
    const nextActivation = getNextActivation(campaign.schedule);

    // Animation configuration
    const [isHovered, setIsHovered] = useState(false);

    // Animation configuration
    const animationProps = useSpring({
        from: {opacity: 0, transform: 'scale(0.5)'},
        to: {opacity: 1, transform: 'scale(1)'},
        config: {duration: 500}
    });


    // Vibration animation on hover
    const vibrationAnimationProps = useSpring({
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        config: {duration: 250}
    });


    // State for confirmation dialog
    const [confirmOpen, setConfirmOpen] = useState(false);

    // State for success snackbar
    const [successOpen, setSuccessOpen] = useState(false);


    // Redux dispatch
    const dispatch = useDispatch();

    // Function to handle opening confirmation dialog
    const handleConfirmOpen = () => {
        setConfirmOpen(true);
    };

    // Function to handle closing confirmation dialog
    const handleConfirmClose = () => {
        setConfirmOpen(false);
    };

    // Function to handle deleting campaign
    const handleDelete = () => {
        dispatch(deleteCampaign(campaign.id));
        setSuccessOpen(true); // Show success snackbar
    };

    // Function to handle closing success snackbar
    const handleSuccessClose = () => {
        setSuccessOpen(false);
    };

    return (
        // Animated Material-UI Card component to display the campaign details in a card layout
        <animated.div style={{...vibrationAnimationProps, width: "100%", overflow: "visible", marginBottom: 2}}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
        >
            <animated.div style={{...animationProps, width: "100%", overflow: "visible", marginBottom: 2}}>
                <Card variant="outlined" sx={{width: "100%", overflow: "visible", marginBottom: 2}}>
                    <CardContent>
                        <Box mb={2}>
                            <Typography variant="h5" component="h2">
                                {campaign.type}
                            </Typography>
                        </Box>
                        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", gap: "24px"}}>
                            <Box mb={1}>
                                <Typography variant="body2" component="p">
                                    Start Date: {campaign.startDate}
                                </Typography>
                            </Box>
                            <Box mb={1}>
                                <Typography variant="body2" component="p">
                                    End Date: {campaign.endDate}
                                </Typography>
                            </Box>
                        </Box>
                        <Box mb={1}>
                            <Typography variant="body2" component="p">
                                Next Activation: {nextActivation}
                            </Typography>
                        </Box>
                    </CardContent>
                    <CardActions sx={{justifyContent: "center"}}>
                        <Button variant="contained" color="primary" onClick={() => handleEditCampaign(campaign.id)}>
                            Edit
                        </Button>
                        <Button variant="contained" color="error" onClick={handleConfirmOpen}>
                            Delete
                        </Button>
                    </CardActions>
                </Card>

                {/* Confirmation Dialog */}
                <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1">Are you sure you want to delete this campaign?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleConfirmClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleDelete} color="error">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Success Snackbar */}
                <Snackbar open={successOpen} autoHideDuration={50000} onClose={handleSuccessClose}
                          message="Campaign deleted successfully"/>
            </animated.div>
        </animated.div>
    );
};

export default CampaignItem;
