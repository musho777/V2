'use client';

import { useSearchParams } from 'next/navigation';

import { Card } from 'antd';

import { Button } from '@/components/Button';
import { ErpEditIcon } from '@/components/Icons/ErpEditIcon';
import { Input } from '@/components/Input';
import { Typography } from '@/components/Typography';

import { useCustomer } from '../../hooks/useCustomer';
import type { ClientType, DocumentType } from '../../types/customer.types';

import styles from './LegalEntityDetailsPage.module.scss';

export default function LegalEntityDetailsPage() {
  const searchParams = useSearchParams();
  const clientType = (searchParams.get('type') || '2') as ClientType;
  const documentType = (searchParams.get('documentType') ||
    'armenian_passport') as DocumentType;
  const firstName = searchParams.get('firstName') || '';
  const lastName = searchParams.get('lastName') || '';
  const middleName = searchParams.get('middleName') || '';

  const {
    formData,
    addresses,
    phones,
    submitted,
    isSubmitting,
    error,
    handleFormDataChange,
    handleAddAddress,
    handleAddPhone,
    handleAddressChange,
    handlePhoneChange,
    toggleEdit,
    isFieldDisabled,
    createCustomer,
    handleCancel,
  } = useCustomer({
    clientType,
    documentType,
    firstName,
    lastName,
    middleName,
  });

  // Get document label based on type
  const getDocumentLabel = () => {
    switch (documentType) {
      case 'armenian_id':
        return 'ID քարտի համար';
      case 'foreign_passport':
        return 'Ոչ-հայկական անձնագրի համար';
      case 'armenian_passport':
      default:
        return 'Անձնագրի համար';
    }
  };

  // Get document type name for display
  const getDocumentTypeName = () => {
    switch (documentType) {
      case 'armenian_id':
        return 'Հայկական ID քարտ';
      case 'foreign_passport':
        return 'Ոչ-հայկական անձնագիր';
      case 'armenian_passport':
      default:
        return 'Հայկական անձնագիր';
    }
  };

  // Get client type name for header
  const getClientTypeName = () => {
    switch (clientType) {
      case '1':
        return 'Անհատ ձեռներեց';
      case '3':
        return 'Ֆիզիկական անձ';
      case '2':
      default:
        return 'Իրավաբանական անձ';
    }
  };

  const handleSubmit = async () => {
    try {
      await createCustomer();
      // Optionally redirect after successful submission
      // router.push('/erp/search-client');
    } catch (error) {
      console.error('Failed to create customer:', error);
    }
  };

  return (
    <div className={styles.legalEntityDetailsPage}>
      <div className={styles.pageWrapper}>
        <div className={styles.cardHeader}>
          <Typography variant="heading2">Նոր բաժանորդի ստեղծում</Typography>
          <Typography variant="body1">
            {getClientTypeName()} - {getDocumentTypeName()}
          </Typography>
        </div>

        {error && (
          <div
            style={{
              color: 'red',
              marginBottom: '16px',
              padding: '12px',
              background: '#fff1f0',
              border: '1px solid #ffccc7',
              borderRadius: '4px',
            }}
          >
            Սխալ: {error}
          </div>
        )}

        <Card style={{ maxWidth: '930px' }}>
          <div className={styles.formContainer}>
            {/* Row 1: Կազմակերպության անվանում - Hidden for type 3 */}
            {clientType !== '3' && (
              <div className={styles.formRow}>
                <div className={styles.inputWrapper}>
                  <Input
                    label="Կազմակերպության անվանում *"
                    placeholder="Մուտքագրեք կազմակերպության անվանումը"
                    height={48}
                    width={656}
                    value={formData.organizationName}
                    onChange={(e) =>
                      handleFormDataChange('organizationName', e.target.value)
                    }
                    disabled={isFieldDisabled('organizationName')}
                  />
                  {submitted && (
                    <ErpEditIcon
                      className={styles.editIcon}
                      onClick={() => toggleEdit('organizationName')}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Row 2: Անձնագրի համար / ID քարտի համար, Տրման ամսաթիվ */}
            <div className={styles.formRow}>
              <div className={styles.inputWrapper}>
                <Input
                  label={getDocumentLabel()}
                  placeholder={`Մուտքագրեք ${getDocumentLabel().toLowerCase()}`}
                  height={48}
                  width={320}
                  value={formData.passportNumber}
                  onChange={(e) =>
                    handleFormDataChange('passportNumber', e.target.value)
                  }
                  disabled={isFieldDisabled('passportNumber')}
                />
                {submitted && (
                  <ErpEditIcon
                    className={styles.editIcon}
                    onClick={() => toggleEdit('passportNumber')}
                  />
                )}
              </div>
              <div className={styles.inputWrapper}>
                <Input
                  type="date"
                  label="Տրման ամսաթիվ"
                  placeholder="Ընտրեք տրման ամսաթիվը"
                  height={48}
                  width={320}
                  value={formData.issueDate}
                  onChange={(e) =>
                    handleFormDataChange('issueDate', e.target.value)
                  }
                  disabled={isFieldDisabled('issueDate')}
                />
                {submitted && (
                  <ErpEditIcon
                    className={styles.editIcon}
                    onClick={() => toggleEdit('issueDate')}
                  />
                )}
              </div>
            </div>

            {/* Row 3: Ում կողմից է տրված, Գրանցման հասցե */}
            <div className={styles.formRow}>
              <div className={styles.inputWrapper}>
                <Input
                  label="Ում կողմից է տրված"
                  placeholder="Մուտքագրեք"
                  height={48}
                  width={320}
                  value={formData.issuedBy}
                  onChange={(e) =>
                    handleFormDataChange('issuedBy', e.target.value)
                  }
                  disabled={isFieldDisabled('issuedBy')}
                />
                {submitted && (
                  <ErpEditIcon
                    className={styles.editIcon}
                    onClick={() => toggleEdit('issuedBy')}
                  />
                )}
              </div>
              <div className={styles.inputWrapper}>
                <Input
                  label="Գրանցման հասցե"
                  placeholder="Մուտքագրեք գրանցման հասցեն"
                  height={48}
                  width={320}
                  value={formData.registrationAddress}
                  onChange={(e) =>
                    handleFormDataChange('registrationAddress', e.target.value)
                  }
                  disabled={isFieldDisabled('registrationAddress')}
                />
                {submitted && (
                  <ErpEditIcon
                    className={styles.editIcon}
                    onClick={() => toggleEdit('registrationAddress')}
                  />
                )}
              </div>
            </div>

            {/* Row 4: Սոց. քարտի համար, Ծանուցումների հասցե */}
            <div className={styles.formRow}>
              <div className={styles.inputWrapper}>
                <Input
                  label="Սոց. քարտի համար"
                  placeholder="Մուտքագրեք սոց. քարտի համարը"
                  height={48}
                  width={320}
                  value={formData.socialCardNumber}
                  onChange={(e) =>
                    handleFormDataChange('socialCardNumber', e.target.value)
                  }
                  disabled={isFieldDisabled('socialCardNumber')}
                />
                {submitted && (
                  <ErpEditIcon
                    className={styles.editIcon}
                    onClick={() => toggleEdit('socialCardNumber')}
                  />
                )}
              </div>
              <div className={styles.inputWrapper}>
                <Input
                  label="Ծանուցումների հասցե"
                  placeholder="Մուտքագրեք ծանուցումների հասցեն"
                  height={48}
                  width={320}
                  value={formData.notificationAddress}
                  onChange={(e) =>
                    handleFormDataChange('notificationAddress', e.target.value)
                  }
                  disabled={isFieldDisabled('notificationAddress')}
                />
                {submitted && (
                  <ErpEditIcon
                    className={styles.editIcon}
                    onClick={() => toggleEdit('notificationAddress')}
                  />
                )}
              </div>
            </div>

            {/* Ծառայությունների մատուցման հասցե Section */}
            <div className={styles.serviceAddressSection}>
              <div className={styles.sectionHeader}>
                <Typography variant="heading3">
                  Ծառայությունների մատուցման հասցե
                </Typography>
                {!submitted && (
                  <Button buttonType="action" onClick={handleAddAddress}>
                    +Ավելացնել հասցե
                  </Button>
                )}
              </div>

              {addresses.map((address, index) => (
                <div key={address.id} className={styles.addressForm}>
                  <Typography variant="heading4">Հասցե {index + 1}</Typography>
                  {/* Row 1: Փողոց, Տուն */}
                  <div className={styles.formRow}>
                    <div className={styles.inputWrapper}>
                      <Input
                        label="Փողոց"
                        placeholder="Ընտրեք փողոցը"
                        height={48}
                        width={320}
                        value={address.street}
                        onChange={(e) =>
                          handleAddressChange(
                            address.id,
                            'street',
                            e.target.value,
                          )
                        }
                        disabled={isFieldDisabled(
                          `address_${address.id}_street`,
                        )}
                      />
                      {submitted && (
                        <ErpEditIcon
                          className={styles.editIcon}
                          onClick={() =>
                            toggleEdit(`address_${address.id}_street`)
                          }
                        />
                      )}
                    </div>
                    <div className={styles.inputWrapper}>
                      <Input
                        label="Տուն"
                        placeholder="Ընտրեք տունը"
                        height={48}
                        width={320}
                        value={address.building}
                        onChange={(e) =>
                          handleAddressChange(
                            address.id,
                            'building',
                            e.target.value,
                          )
                        }
                        disabled={isFieldDisabled(
                          `address_${address.id}_building`,
                        )}
                      />
                      {submitted && (
                        <ErpEditIcon
                          className={styles.editIcon}
                          onClick={() =>
                            toggleEdit(`address_${address.id}_building`)
                          }
                        />
                      )}
                    </div>
                  </div>

                  {/* Row 2: Բն/Օֆիս, Սենյակի համար, Մուտք, Հարկ */}
                  <div className={styles.formRow}>
                    <div className={styles.inputWrapper}>
                      <Input
                        label="Բն/Օֆիս"
                        placeholder="Մուտքագրեք"
                        height={48}
                        width={250}
                        value={address.apartment}
                        onChange={(e) =>
                          handleAddressChange(
                            address.id,
                            'apartment',
                            e.target.value,
                          )
                        }
                        disabled={isFieldDisabled(
                          `address_${address.id}_apartment`,
                        )}
                      />
                      {submitted && (
                        <ErpEditIcon
                          className={styles.editIcon}
                          onClick={() =>
                            toggleEdit(`address_${address.id}_apartment`)
                          }
                        />
                      )}
                    </div>
                    <div className={styles.inputWrapper}>
                      <Input
                        label="Սենյակի համար"
                        placeholder="Մուտքագրեք"
                        height={48}
                        width={150}
                        value={address.roomNumber}
                        onChange={(e) =>
                          handleAddressChange(
                            address.id,
                            'roomNumber',
                            e.target.value,
                          )
                        }
                        disabled={isFieldDisabled(
                          `address_${address.id}_roomNumber`,
                        )}
                      />
                      {submitted && (
                        <ErpEditIcon
                          className={styles.editIcon}
                          onClick={() =>
                            toggleEdit(`address_${address.id}_roomNumber`)
                          }
                        />
                      )}
                    </div>
                    <div className={styles.inputWrapper}>
                      <Input
                        label="Մուտք"
                        placeholder="Մուտքագրեք"
                        height={48}
                        width={150}
                        value={address.entrance}
                        onChange={(e) =>
                          handleAddressChange(
                            address.id,
                            'entrance',
                            e.target.value,
                          )
                        }
                        disabled={isFieldDisabled(
                          `address_${address.id}_entrance`,
                        )}
                      />
                      {submitted && (
                        <ErpEditIcon
                          className={styles.editIcon}
                          onClick={() =>
                            toggleEdit(`address_${address.id}_entrance`)
                          }
                        />
                      )}
                    </div>
                    <div className={styles.inputWrapper}>
                      <Input
                        label="Հարկ"
                        placeholder="Մուտքագրեք"
                        height={48}
                        width={150}
                        value={address.floor}
                        onChange={(e) =>
                          handleAddressChange(
                            address.id,
                            'floor',
                            e.target.value,
                          )
                        }
                        disabled={isFieldDisabled(
                          `address_${address.id}_floor`,
                        )}
                      />
                      {submitted && (
                        <ErpEditIcon
                          className={styles.editIcon}
                          onClick={() =>
                            toggleEdit(`address_${address.id}_floor`)
                          }
                        />
                      )}
                    </div>
                  </div>

                  {/* Row 3: Մեկնաբանություն */}
                  <div className={styles.formRow}>
                    <div className={styles.inputWrapper}>
                      <Input
                        label="Մեկնաբանություն"
                        placeholder="Մուտքագրեք մեկնաբանություն"
                        height={48}
                        width={656}
                        value={address.comment}
                        onChange={(e) =>
                          handleAddressChange(
                            address.id,
                            'comment',
                            e.target.value,
                          )
                        }
                        disabled={isFieldDisabled(
                          `address_${address.id}_comment`,
                        )}
                      />
                      {submitted && (
                        <ErpEditIcon
                          className={styles.editIcon}
                          onClick={() =>
                            toggleEdit(`address_${address.id}_comment`)
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Row: Էլ․ փոստ, ERP External Id, ՀՎՀՀ, Գտնվելու վայրի հասցեն */}
            <div className={styles.formRowFour}>
              <div className={styles.inputWrapper}>
                <Input
                  label="Էլ․ փոստ"
                  placeholder="Մուտքագրեք էլ․ փոստը"
                  height={48}
                  width={350}
                  value={formData.email}
                  onChange={(e) =>
                    handleFormDataChange('email', e.target.value)
                  }
                  disabled={isFieldDisabled('email')}
                />
                {submitted && (
                  <ErpEditIcon
                    className={styles.editIcon}
                    onClick={() => toggleEdit('email')}
                  />
                )}
              </div>
              <div className={styles.inputWrapper}>
                <Input
                  label="ERP External Id"
                  placeholder="Մուտքագրեք"
                  height={48}
                  width={350}
                  value={formData.erpExternalId}
                  onChange={(e) =>
                    handleFormDataChange('erpExternalId', e.target.value)
                  }
                  disabled={isFieldDisabled('erpExternalId')}
                />
                {submitted && (
                  <ErpEditIcon
                    className={styles.editIcon}
                    onClick={() => toggleEdit('erpExternalId')}
                  />
                )}
              </div>
            </div>
            {/* ՀՎՀՀ and Գտնվելու վայրի հասցեն - Hidden for type 3 */}
            {clientType !== '3' && (
              <div className={styles.formRowFour}>
                <div className={styles.inputWrapper}>
                  <Input
                    label="ՀՎՀՀ"
                    placeholder="Մուտքագրեք ՀՎՀՀ"
                    height={48}
                    width={350}
                    value={formData.taxId}
                    onChange={(e) =>
                      handleFormDataChange('taxId', e.target.value)
                    }
                    disabled={isFieldDisabled('taxId')}
                  />
                  {submitted && (
                    <ErpEditIcon
                      className={styles.editIcon}
                      onClick={() => toggleEdit('taxId')}
                    />
                  )}
                </div>
                <div className={styles.inputWrapper}>
                  <Input
                    label="Գտնվելու վայրի հասցեն"
                    placeholder="Մուտքագրեք հասցեն"
                    height={48}
                    width={350}
                    value={formData.locationAddress}
                    onChange={(e) =>
                      handleFormDataChange('locationAddress', e.target.value)
                    }
                    disabled={isFieldDisabled('locationAddress')}
                  />
                  {submitted && (
                    <ErpEditIcon
                      className={styles.editIcon}
                      onClick={() => toggleEdit('locationAddress')}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Հեռախոսահամար Section */}
            <div className={styles.phoneSection}>
              <div className={styles.sectionHeader}>
                <Typography variant="heading3">
                  Ավելացնել Հեռախոսահամար *
                </Typography>
                {!submitted && (
                  <Button buttonType="action" onClick={handleAddPhone}>
                    +Ավելացնել Հեռախոսահամար
                  </Button>
                )}
              </div>

              {phones.map((phone, index) => (
                <div key={phone.id} className={styles.phoneForm}>
                  <Typography variant="heading4">
                    Հեռախոսահամար {index + 1}
                  </Typography>
                  <div className={styles.formRow}>
                    <div className={styles.inputWrapper}>
                      <Input
                        label="Հեռախոսահամար"
                        placeholder="Մուտքագրեք հեռախոսահամարը"
                        height={48}
                        width={320}
                        value={phone.phoneNumber}
                        onChange={(e) =>
                          handlePhoneChange(
                            phone.id,
                            'phoneNumber',
                            e.target.value,
                          )
                        }
                        disabled={isFieldDisabled(
                          `phone_${phone.id}_phoneNumber`,
                        )}
                      />
                      {submitted && (
                        <ErpEditIcon
                          className={styles.editIcon}
                          onClick={() =>
                            toggleEdit(`phone_${phone.id}_phoneNumber`)
                          }
                        />
                      )}
                    </div>
                    <div className={styles.inputWrapper}>
                      <Input
                        label="Մեկնաբանություն"
                        placeholder="Մուտքագրեք մեկնաբանություն"
                        height={48}
                        width={320}
                        value={phone.comment}
                        onChange={(e) =>
                          handlePhoneChange(phone.id, 'comment', e.target.value)
                        }
                        disabled={isFieldDisabled(`phone_${phone.id}_comment`)}
                      />
                      {submitted && (
                        <ErpEditIcon
                          className={styles.editIcon}
                          onClick={() =>
                            toggleEdit(`phone_${phone.id}_comment`)
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Birthday Field - For Անհատ ձեռներեց (type 1) and Ֆիզիկական անձ (type 3) */}
            {(clientType === '1' || clientType === '3') && (
              <div className={styles.birthdaySection}>
                <div className={styles.inputWrapper}>
                  <Input
                    type="date"
                    label="Ծննդյան ամսաթիվ *"
                    placeholder="Ընտրեք ծննդյան ամսաթիվը"
                    height={48}
                    width={320}
                    value={formData.birthDate}
                    onChange={(e) =>
                      handleFormDataChange('birthDate', e.target.value)
                    }
                    disabled={isFieldDisabled('birthDate')}
                  />
                  {submitted && (
                    <ErpEditIcon
                      className={styles.editIcon}
                      onClick={() => toggleEdit('birthDate')}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <Button
                buttonType="primary"
                variant="outlined"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Չեղարկել
              </Button>
              <Button
                buttonType="action"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Հաստատվում է...' : 'Հաստատել'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
