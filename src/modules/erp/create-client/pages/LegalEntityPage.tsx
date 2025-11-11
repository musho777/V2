'use client';

import { useState } from 'react';

import { Card } from 'antd';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

import styles from './LegalEntityPage.module.scss';

export default function LegalEntityPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    taxId: '',
    registrationNumber: '',
    email: '',
    website: '',
    phone: '',
  });

  const handleAddAddress = () => {
    // TODO: Implement add address functionality
  };

  const handleAddPhone = () => {
    // TODO: Implement add phone functionality
  };

  const handleCancel = () => {
    // TODO: Implement cancel functionality
  };

  const handleNext = () => {
    // TODO: Implement next step functionality
  };

  return (
    <div className={styles.legalEntityPage}>
      <div className={styles.pageWrapper}>
        <Card style={{ maxWidth: '930px' }}>
          <div className={styles.formContainer}>
            {/* Row 1: Single Input */}
            <div className={styles.formRow}>
              <Input
                label="Կազմակերպության անվանումը"
                placeholder="Մուտքագրեք կազմակերպության անվանումը"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                height={48}
                width={320}
              />
            </div>

            {/* Row 2: Two Inputs */}
            <div className={styles.formRow}>
              <Input
                label="ՀՎՀՀ"
                placeholder="Մուտքագրեք ՀՎՀՀ"
                value={formData.taxId}
                onChange={(e) =>
                  setFormData({ ...formData, taxId: e.target.value })
                }
                height={48}
                width={320}
              />
              <Input
                label="Գրանցման համար"
                placeholder="Մուտքագրեք գրանցման համարը"
                value={formData.registrationNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    registrationNumber: e.target.value,
                  })
                }
                height={48}
                width={320}
              />
            </div>

            {/* Row 3: Two Inputs */}
            <div className={styles.formRow}>
              <Input
                label="Էլ. հասցե"
                placeholder="Մուտքագրեք էլ. հասցեն"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                height={48}
                width={320}
              />
              <Input
                label="Կայք"
                placeholder="Մուտքագրեք կայքի հասցեն"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                height={48}
                width={320}
              />
            </div>

            {/* Row 4: Add Address Button */}
            <div className={styles.formRow}>
              <Button buttonType="action" onClick={handleAddAddress}>
                + Ավելացնել հասցե
              </Button>
            </div>

            {/* Row 5: Two Inputs */}
            <div className={styles.formRow}>
              <Input
                label="Հասցե"
                placeholder="Մուտքագրեք հասցեն"
                height={48}
                width={320}
              />
              <Input
                label="Հասցե 2"
                placeholder="Մուտքագրեք հասցեն"
                height={48}
                width={320}
              />
            </div>

            {/* Row 6: Add Phone Button */}
            <div className={styles.formRow}>
              <Button buttonType="action" onClick={handleAddPhone}>
                + Ավելացնել հեռախոսահամար
              </Button>
            </div>

            {/* Row 7: One Input */}
            <div className={styles.formRow}>
              <Input
                label="Հեռախոսահամար"
                placeholder="Մուտքագրեք հեռախոսահամարը"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                height={48}
                width={320}
              />
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <Button onClick={handleCancel}>Չեղարկել</Button>
              <Button buttonType="primary" onClick={handleNext}>
                Հաջորդը
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
