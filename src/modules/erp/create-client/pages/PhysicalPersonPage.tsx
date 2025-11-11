'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Card, Radio } from 'antd';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Typography } from '@/components/Typography';

import styles from './CreateClientPage.module.scss';

const CLIENT_TYPES = {
  '1': 'Անհատ ձեռներեց',
  '2': 'Իրավաբանական անձ',
  '3': 'Ֆիզիկական անձ',
};

export default function PhysicalPersonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientType = searchParams.get('type') || '3';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    documentType: '',
  });

  const handleNext = () => {
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.middleName.trim() ||
      !formData.documentType
    ) {
      return;
    }

    // Navigate based on client type - all types navigate to details page
    const params = new URLSearchParams({
      type: clientType,
      documentType: formData.documentType,
      firstName: formData.firstName,
      lastName: formData.lastName,
      middleName: formData.middleName,
    });
    router.push(`/erp/create-client/legal-entity-details?${params.toString()}`);
  };

  const handleCancel = () => {
    router.push('/erp/create-client');
  };

  return (
    <div className={styles.createClientPage}>
      <div className={styles.pageWrapper}>
        <div className={styles.cardHeader}>
          <Typography variant="heading2">Նոր բաժանորդի ստեղծում</Typography>
          <Typography variant="body1">
            {CLIENT_TYPES[clientType as keyof typeof CLIENT_TYPES]}
          </Typography>
        </div>

        <Card
          style={{ maxWidth: '930px', maxHeight: '100%', minHeight: '450px' }}
        >
          <div style={{ padding: '24px' }}>
            {/* First Row - Անուն, Ազգանուն */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '16px',
              }}
            >
              <Input
                label="Անուն"
                placeholder="Մուտքագրեք անունը"
                height={48}
                width={320}
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
              <Input
                label="Ազգանուն"
                placeholder="Մուտքագրեք ազգանունը"
                height={48}
                width={320}
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>

            {/* Second Row - Հայրանուն */}
            <div style={{ marginBottom: '24px' }}>
              <Input
                label="Հայրանուն"
                placeholder="Մուտքագրեք հայրանունը"
                height={48}
                width={320}
                value={formData.middleName}
                onChange={(e) =>
                  setFormData({ ...formData, middleName: e.target.value })
                }
              />
            </div>

            {/* Radio Group */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ marginBottom: '8px', fontWeight: 500 }}>
                Ընտրեք փաստաթղթի տեսակը
              </div>
              <Radio.Group
                value={formData.documentType}
                onChange={(e) =>
                  setFormData({ ...formData, documentType: e.target.value })
                }
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <Radio value="armenian_passport">Հայկական անձնագիր</Radio>
                  <Radio value="armenian_id">
                    Հայկական նույնականացման (ID) քարտ
                  </Radio>
                  <Radio value="foreign_passport">Ոչ-հայկական անձնագիր</Radio>
                </div>
              </Radio.Group>
            </div>

            {/* Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                buttonType="primary"
                variant="outlined"
                onClick={handleCancel}
              >
                Չեղարկել
              </Button>
              <Button buttonType="action" onClick={handleNext}>
                Առաջ
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
