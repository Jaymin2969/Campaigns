import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import CampaignItem from './CampaignItem';
import {Campaign} from '../../types';
import styles from './style.module.css'

interface CampaignListProps {
    handleEditCampaign: (campaignId?: string) => void; // Function to handle editing a campaign
}

const CampaignList: React.FC<CampaignListProps> = ({handleEditCampaign}) => {
    // Fetch campaigns from Redux store using useSelector hook
    const campaigns = useSelector((state: RootState) => state.campaigns.campaigns);

    // Check if campaigns exist and have a length
    const hasCampaigns = campaigns && campaigns.length > 0;

    return (
        <div>
            <h1>Campaign List</h1>

            <div className={styles.contentWrapper}>
                {hasCampaigns ? (
                    // Map through campaigns and render CampaignItem for each campaign
                    campaigns.map((campaign: Campaign) => (
                        <CampaignItem key={campaign.id} campaign={campaign} handleEditCampaign={handleEditCampaign}/>
                    ))
                ) : (
                    // Display a message when no campaigns are available
                    <div>No campaigns available</div>
                )}
            </div>

        </div>
    );
};

export default CampaignList;
