'use client';

import { useRouter } from 'next/navigation';

import { Card } from 'antd';

import { IndividualEntrepreneurIcon } from '@/components/Icons/IndividualEntrepreneurIcon';
import { LegalEntityIcon } from '@/components/Icons/LegalEntityIcon';
import { PhysicalPersonIcon } from '@/components/Icons/PhysicalPersonIcon';
import { Typography } from '@/components/Typography';

import styles from './CreateClientPage.module.scss';

export default function CreateClientPage() {
  const router = useRouter();
  return (
    <div className={styles.createClientPage}>
      <div className={styles.pageWrapper}>
        <div className={styles.cardHeader}>
          <Typography variant="heading2">Նոր բաժանորդի ստեղծում</Typography>
          <Typography variant="body1">Ընտրեք բաժինը և լրացրեք</Typography>
        </div>

        <Card
          style={{ maxWidth: '930px', maxHeight: '100%', minHeight: '350px' }}
        >
          <div className={styles.optionsContainer}>
            <div
              className={styles.optionCard}
              style={{
                borderColor: 'rgba(45, 108, 223, 1)',
                cursor: 'pointer',
              }}
              onClick={() =>
                router.push('/erp/create-client/physical-person?type=1')
              }
            >
              <div className={styles.iconWrapper}>
                <IndividualEntrepreneurIcon color="rgba(45, 108, 223, 1)" />
              </div>
              <Typography variant="body1" className={styles.optionText}>
                Անհատ ձեռներեց
              </Typography>
            </div>

            <div
              className={styles.optionCard}
              style={{
                borderColor: 'rgba(21, 199, 167, 1)',
                cursor: 'pointer',
              }}
              onClick={() =>
                router.push('/erp/create-client/physical-person?type=2')
              }
            >
              <div className={styles.iconWrapper}>
                <LegalEntityIcon color="rgba(21, 199, 167, 1)" />
              </div>
              <Typography variant="body1" className={styles.optionText}>
                Իրավաբանական անձ
              </Typography>
            </div>

            <div
              className={styles.optionCard}
              style={{
                borderColor: 'rgba(145, 65, 219, 1)',
                cursor: 'pointer',
              }}
              onClick={() =>
                router.push('/erp/create-client/physical-person?type=3')
              }
            >
              <div className={styles.iconWrapper}>
                <PhysicalPersonIcon color="rgba(145, 65, 219, 1)" />
              </div>
              <Typography variant="body1" className={styles.optionText}>
                Ֆիզիկական անձ
              </Typography>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
