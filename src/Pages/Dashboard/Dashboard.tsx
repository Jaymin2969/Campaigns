import React, {useState} from 'react';
import CampaignForm from '../../Components/Campaign/CampaignForm';
import CampaignList from '../../Components/Campaign/CampaignList';
import {Box} from '@mui/material';
import styles from './dashboard.module.css'

const Dashborad: React.FC = () => {
    const [editCampaignId, setEditCampaignId] = useState("");

    const handleEditCampaign = (campaignId: any) => {
        setEditCampaignId(campaignId)
    }
    const handleCloseAddCampaign = () => {
        setEditCampaignId("")
    }


    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: "50% 50%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    width: "100%"
                }}>
                    <CampaignForm campaignId={editCampaignId} onClose={handleCloseAddCampaign}/>
                    <CampaignList handleEditCampaign={handleEditCampaign}/>
                </Box>
            </div>
        </div>

    );
};

export default Dashborad;
