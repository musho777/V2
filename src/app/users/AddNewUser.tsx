'use client';

import { useState } from 'react';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select';
import { Typography } from '@/components/Typography';

import styles from './styles.module.scss';

export interface AddNewUserProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: AddNewUserFormData) => void;
  rolesOptions?: Array<{ value: string; label: string }>;
  occupationOptions?: Array<{ value: string; label: string }>;
  timeZoneOptions?: Array<{ value: string; label: string }>;
  holidaysOptions?: Array<{ value: string; label: string }>;
  officeLocationOptions?: Array<{ value: string; label: string }>;
  commissionsOptions?: Array<{ value: string; label: string }>;
  onRolesDropdownOpen?: () => void;
  onOccupationDropdownOpen?: () => void;
  onTimezoneDropdownOpen?: () => void;
  onHolidaysDropdownOpen?: () => void;
  onOfficeLocationDropdownOpen?: () => void;
  onCommissionsDropdownOpen?: () => void;
  // Step 1 customization
  step1Title?: string;
  step1Subtitle?: string;
  step1CancelText?: string;
  step1NextText?: string;
  showStep1Footer?: boolean;
  // Step 2 customization
  step2Title?: string;
  step2Subtitle?: string;
  step2BackText?: string;
  step2SubmitText?: string;
  showStep2Footer?: boolean;
  // Modal customization
  modalWidth?: number;
}

export interface AddNewUserFormData {
  firstName: string;
  surname: string;
  roleId: string;
  email: string;
  phoneNumber: string;
  occupationId: string;
  timeZone: string;
  holidays: string;
  officeLocation: string;
  commissions: string;
}

export const AddNewUser: React.FC<AddNewUserProps> = ({
  open,
  onClose,
  onSubmit,
  rolesOptions = [],
  occupationOptions = [],
  timeZoneOptions = [],
  holidaysOptions = [],
  officeLocationOptions = [],
  commissionsOptions = [],
  onRolesDropdownOpen,
  onOccupationDropdownOpen,
  onTimezoneDropdownOpen,
  onHolidaysDropdownOpen,
  onOfficeLocationDropdownOpen,
  onCommissionsDropdownOpen,
  step1Title = 'Add New User',
  step1Subtitle = 'Please fill in the user information to send an invitation',
  step1CancelText = 'Cancel',
  step1NextText = 'Next',
  showStep1Footer = true,
  step2Title = 'Add New User',
  step2Subtitle = 'Configure additional settings for the user',
  step2BackText = 'Back',
  step2SubmitText = 'Invite',
  showStep2Footer = true,
  modalWidth = 474,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AddNewUserFormData>({
    firstName: '',
    surname: '',
    roleId: '',
    email: '',
    phoneNumber: '',
    occupationId: '',
    timeZone: '',
    holidays: '',
    officeLocation: '',
    commissions: '',
  });

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      firstName: '',
      surname: '',
      roleId: '',
      email: '',
      phoneNumber: '',
      occupationId: '',
      timeZone: '',
      holidays: '',
      officeLocation: '',
      commissions: '',
    });
    onClose();
  };

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = () => {
    onSubmit?.(formData);
    handleClose();
  };

  const updateFormData = (field: keyof AddNewUserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      showFooter={false}
      width={modalWidth}
    >
      {currentStep === 1 ? (
        <div>
          <div className={styles.modalHeader}>
            <Typography variant="heading2" className={styles.modalTitle}>
              {step1Title}
            </Typography>
            <Typography variant="body2" className={styles.modalSubtitle}>
              {step1Subtitle}
            </Typography>
          </div>

          <div className={styles.modalForm}>
            <div className={styles.modalRow}>
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={(e) => updateFormData('firstName', e.target.value)}
                placeholder="Enter first name"
                width="205px"
              />
              <Input
                label="Surname"
                value={formData.surname}
                onChange={(e) => updateFormData('surname', e.target.value)}
                placeholder="Enter surname"
                width="205px"
              />
            </div>

            <Select
              label="Role"
              placeholder="Select role"
              options={rolesOptions}
              value={formData.roleId || undefined}
              onChange={(value) => updateFormData('roleId', value as string)}
              onOpenChange={(open) => {
                if (open) {
                  onRolesDropdownOpen?.();
                }
              }}
              width="100%"
              height={48}
              allowClear
            />

            <Select
              label="Occupation"
              placeholder="Select occupation"
              options={occupationOptions}
              value={formData.occupationId || undefined}
              onChange={(value) =>
                updateFormData('occupationId', value as string)
              }
              onOpenChange={(open) => {
                if (open) {
                  onOccupationDropdownOpen?.();
                }
              }}
              width="100%"
              height={48}
              allowClear
            />

            <Input
              label="Email Address"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder="Enter email address"
              width="100%"
              type="email"
            />

            <Input
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => updateFormData('phoneNumber', e.target.value)}
              placeholder="Enter phone number"
              width="100%"
              type="tel"
            />
          </div>

          {showStep1Footer && (
            <div className={styles.modalFooter}>
              <Button
                variant="outlined"
                onClick={handleClose}
                className={styles.modalButton}
              >
                {step1CancelText}
              </Button>
              <Button
                buttonType="action"
                onClick={handleNext}
                className={styles.modalButton}
              >
                {step1NextText}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className={styles.modalHeader}>
            <Typography variant="heading2" className={styles.modalTitle}>
              {step2Title}
            </Typography>
            <Typography variant="body2" className={styles.modalSubtitle}>
              {step2Subtitle}
            </Typography>
          </div>

          <div className={styles.modalForm}>
            <Select
              label="Time Zone"
              placeholder="Select timezone"
              options={timeZoneOptions}
              value={formData.timeZone || undefined}
              onChange={(value) => updateFormData('timeZone', value as string)}
              onOpenChange={(open) => {
                if (open) {
                  onTimezoneDropdownOpen?.();
                }
              }}
              width="100%"
              height={48}
              allowClear
            />

            <Select
              label="Calendar of Holidays"
              placeholder="Select the holidays"
              options={holidaysOptions}
              value={formData.holidays || undefined}
              onChange={(value) => updateFormData('holidays', value as string)}
              onOpenChange={(open) => {
                if (open) {
                  onHolidaysDropdownOpen?.();
                }
              }}
              width="100%"
              height={48}
              allowClear
            />

            <Select
              label="Office Location"
              placeholder="Select office location"
              options={officeLocationOptions}
              value={formData.officeLocation || undefined}
              onChange={(value) =>
                updateFormData('officeLocation', value as string)
              }
              onOpenChange={(open) => {
                if (open) {
                  onOfficeLocationDropdownOpen?.();
                }
              }}
              width="100%"
              height={48}
              allowClear
            />

            <Select
              label="Commissions"
              placeholder="Select the commissions"
              options={commissionsOptions}
              value={formData.commissions || undefined}
              onChange={(value) =>
                updateFormData('commissions', value as string)
              }
              onOpenChange={(open) => {
                if (open) {
                  onCommissionsDropdownOpen?.();
                }
              }}
              width="100%"
              height={48}
              allowClear
            />
          </div>

          {showStep2Footer && (
            <div className={styles.modalFooter}>
              <Button
                variant="outlined"
                onClick={handleBack}
                className={styles.modalButton}
              >
                {step2BackText}
              </Button>
              <Button
                buttonType="action"
                onClick={handleSubmit}
                className={styles.modalButton}
              >
                {step2SubmitText}
              </Button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
