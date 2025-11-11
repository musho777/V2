'use client';

import { useEffect, useState } from 'react';

import { Card } from 'antd';

import { Button } from '@/components/Button';
import { CreateScheduleModal } from '@/components/CreateScheduleModal';
import { EditIconOld } from '@/components/Icons';
import { PageTabs } from '@/components/PageTabs';
import {
  ImportLeadModal,
  LeadSourceModal,
  OfferModal,
  ProductModal,
  SalesScriptModal,
  SalesSettingsFilter,
  UserPrivilegeModal,
  WorkflowStatusModal,
} from '@/components/SalesSettings';
import { ResponsiveTable } from '@/components/Table/Table';
import { Tag } from '@/components/Tag';
import { Typography } from '@/components/Typography';

import styles from './styles.module.scss';

// Temporary mock data for each tab
const mockLeadSources = [
  { key: '1', id: 1, name: 'Website', status: 'Active' },
  { key: '2', id: 2, name: 'Referral', status: 'Active' },
];

const mockSalesScripts = [
  { key: '1', id: 1, name: 'Initial Call Script', status: 'Active' },
  { key: '2', id: 2, name: 'Follow-up Script', status: 'Active' },
];

const mockProducts = [
  { key: '1', id: 1, name: 'Product A', price: 100, status: 'Active' },
  { key: '2', id: 2, name: 'Product B', price: 200, status: 'Active' },
];

const mockOffers = [
  {
    key: '1',
    id: 1,
    name: 'Summer Discount',
    discount: '20%',
    status: 'Active',
  },
  { key: '2', id: 2, name: 'Bundle Offer', discount: '15%', status: 'Active' },
];

const mockWorkflowStatuses = [
  { key: '1', id: 1, name: 'New', order: 1, status: 'Active' },
  { key: '2', id: 2, name: 'In Progress', order: 2, status: 'Active' },
];

const mockImportLeads = [
  {
    key: '1',
    id: 1,
    fileName: 'leads_jan_2025.csv',
    importDate: '2025-01-15',
    recordsCount: 150,
  },
  {
    key: '2',
    id: 2,
    fileName: 'leads_feb_2025.csv',
    importDate: '2025-02-10',
    recordsCount: 200,
  },
];

const mockUserPrivileges = [
  {
    key: '1',
    id: 1,
    userName: 'John Doe',
    role: 'Sales Manager',
    status: 'Active',
  },
  {
    key: '2',
    id: 2,
    userName: 'Jane Smith',
    role: 'Sales Rep',
    status: 'Active',
  },
];

const mockSchedules = [
  {
    key: '1',
    id: 1,
    salaryType: 'Hourly',
    salaryAmount: '$25/hr',
    shiftName: 'Morning Shift',
    shiftTime: '9:00 AM - 5:00 PM',
    workdays: 'Monday - Friday',
    timezone: 'EST',
    effectiveDate: '2025-01-01',
  },
  {
    key: '2',
    id: 2,
    salaryType: 'Fixed',
    salaryAmount: '$5000/month',
    shiftName: 'Evening Shift',
    shiftTime: '2:00 PM - 10:00 PM',
    workdays: 'Monday - Saturday',
    timezone: 'PST',
    effectiveDate: '2025-02-01',
  },
];

export default function SalesSettingsPage() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sales-settings-active-tab') || 'lead-source';
    }
    return 'lead-source';
  });

  const [leadSourceModalOpen, setLeadSourceModalOpen] = useState(false);
  const [salesScriptModalOpen, setSalesScriptModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [workflowStatusModalOpen, setWorkflowStatusModalOpen] = useState(false);
  const [importLeadModalOpen, setImportLeadModalOpen] = useState(false);
  const [userPrivilegeModalOpen, setUserPrivilegeModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  // Edit states for each tab
  const [editingLeadSource, setEditingLeadSource] = useState<any>(null);
  const [editingSalesScript, setEditingSalesScript] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [editingWorkflowStatus, setEditingWorkflowStatus] = useState<any>(null);
  const [editingUserPrivilege, setEditingUserPrivilege] = useState<any>(null);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);

  // Filter states for each tab
  const [leadSourceFilters, setLeadSourceFilters] = useState({
    name: '',
    status: 'all',
  });
  const [salesScriptFilters, setSalesScriptFilters] = useState({
    name: '',
    status: 'all',
  });
  const [productFilters, setProductFilters] = useState({
    name: '',
    status: 'all',
  });
  const [offerFilters, setOfferFilters] = useState({ name: '', status: 'all' });
  const [workflowStatusFilters, setWorkflowStatusFilters] = useState({
    name: '',
    status: 'all',
  });
  const [importLeadFilters, setImportLeadFilters] = useState({
    name: '',
    status: 'all',
  });
  const [userPrivilegeFilters, setUserPrivilegeFilters] = useState({
    name: '',
    status: 'all',
  });

  useEffect(() => {
    localStorage.setItem('sales-settings-active-tab', activeTab);
  }, [activeTab]);

  // Column definitions for each table
  const leadSourceColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag tagType={status === 'Active' ? 'active' : 'inactive'}>
          <Typography variant="body3" as="span">
            {status}
          </Typography>
        </Tag>
      ),
    },
    {
      title: '',
      key: 'action',
      width: '5%',
      render: (_: any, record: any) => (
        <Button
          type="text"
          icon={<EditIconOld />}
          onClick={() => {
            setEditingLeadSource(record);
            setLeadSourceModalOpen(true);
          }}
          style={{ padding: 0 }}
        />
      ),
    },
  ];

  const salesScriptColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag tagType={status === 'Active' ? 'active' : 'inactive'}>
          <Typography variant="body3" as="span">
            {status}
          </Typography>
        </Tag>
      ),
    },
    {
      title: '',
      key: 'action',
      width: '5%',
      render: (_: any, record: any) => (
        <Button
          type="text"
          icon={<EditIconOld />}
          onClick={() => {
            setEditingSalesScript(record);
            setSalesScriptModalOpen(true);
          }}
          style={{ padding: 0 }}
        />
      ),
    },
  ];

  const productColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag tagType={status === 'Active' ? 'active' : 'inactive'}>
          <Typography variant="body3" as="span">
            {status}
          </Typography>
        </Tag>
      ),
    },
    {
      title: '',
      key: 'action',
      width: '5%',
      render: (_: any, record: any) => (
        <Button
          type="text"
          icon={<EditIconOld />}
          onClick={() => {
            setEditingProduct(record);
            setProductModalOpen(true);
          }}
          style={{ padding: 0 }}
        />
      ),
    },
  ];

  const offerColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Discount', dataIndex: 'discount', key: 'discount' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag tagType={status === 'Active' ? 'active' : 'inactive'}>
          <Typography variant="body3" as="span">
            {status}
          </Typography>
        </Tag>
      ),
    },
    {
      title: '',
      key: 'action',
      width: '5%',
      render: (_: any, record: any) => (
        <Button
          type="text"
          icon={<EditIconOld />}
          onClick={() => {
            setEditingOffer(record);
            setOfferModalOpen(true);
          }}
          style={{ padding: 0 }}
        />
      ),
    },
  ];

  const workflowStatusColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Order', dataIndex: 'order', key: 'order' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag tagType={status === 'Active' ? 'active' : 'inactive'}>
          <Typography variant="body3" as="span">
            {status}
          </Typography>
        </Tag>
      ),
    },
    {
      title: '',
      key: 'action',
      width: '5%',
      render: (_: any, record: any) => (
        <Button
          type="text"
          icon={<EditIconOld />}
          onClick={() => {
            setEditingWorkflowStatus(record);
            setWorkflowStatusModalOpen(true);
          }}
          style={{ padding: 0 }}
        />
      ),
    },
  ];

  const importLeadColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'File Name', dataIndex: 'fileName', key: 'fileName' },
    { title: 'Import Date', dataIndex: 'importDate', key: 'importDate' },
    { title: 'Records', dataIndex: 'recordsCount', key: 'recordsCount' },
  ];

  const userPrivilegeColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'User Name', dataIndex: 'userName', key: 'userName' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag tagType={status === 'Active' ? 'active' : 'inactive'}>
          <Typography variant="body3" as="span">
            {status}
          </Typography>
        </Tag>
      ),
    },
    {
      title: '',
      key: 'action',
      width: '5%',
      render: (_: any, record: any) => (
        <Button
          type="text"
          icon={<EditIconOld />}
          onClick={() => {
            setEditingUserPrivilege(record);
            setUserPrivilegeModalOpen(true);
          }}
          style={{ padding: 0 }}
        />
      ),
    },
  ];

  const tabs = [
    {
      key: 'lead-source',
      label: 'Lead Source',
      children: (
        <>
          <Card className={styles.filterCard}>
            <div className={styles.filterSection}>
              <SalesSettingsFilter
                onNameChange={(value) =>
                  setLeadSourceFilters({ ...leadSourceFilters, name: value })
                }
                onStatusChange={(value) =>
                  setLeadSourceFilters({ ...leadSourceFilters, status: value })
                }
                onReset={() =>
                  setLeadSourceFilters({ name: '', status: 'all' })
                }
                nameValue={leadSourceFilters.name}
                statusValue={leadSourceFilters.status}
                namePlaceholder="Search by lead source name"
              />
              <Button
                buttonType="action"
                onClick={() => setLeadSourceModalOpen(true)}
                className={styles.addButton}
              >
                + Add Lead Source
              </Button>
            </div>
          </Card>
          <ResponsiveTable
            columns={leadSourceColumns}
            dataSource={mockLeadSources}
            loading={false}
            pagination={false}
            mobileColumnsCount={3}
          />
        </>
      ),
    },
    {
      key: 'sales-script',
      label: 'Sales Script',
      children: (
        <>
          <Card className={styles.filterCard}>
            <div className={styles.filterSection}>
              <SalesSettingsFilter
                onNameChange={(value) =>
                  setSalesScriptFilters({ ...salesScriptFilters, name: value })
                }
                onStatusChange={(value) =>
                  setSalesScriptFilters({
                    ...salesScriptFilters,
                    status: value,
                  })
                }
                onReset={() =>
                  setSalesScriptFilters({ name: '', status: 'all' })
                }
                nameValue={salesScriptFilters.name}
                statusValue={salesScriptFilters.status}
                namePlaceholder="Search by script name"
              />
              <Button
                buttonType="action"
                onClick={() => setSalesScriptModalOpen(true)}
                className={styles.addButton}
              >
                + Add Sales Script
              </Button>
            </div>
          </Card>
          <ResponsiveTable
            columns={salesScriptColumns}
            dataSource={mockSalesScripts}
            loading={false}
            pagination={false}
            mobileColumnsCount={3}
          />
        </>
      ),
    },
    {
      key: 'product',
      label: 'Product',
      children: (
        <>
          <Card className={styles.filterCard}>
            <div className={styles.filterSection}>
              <SalesSettingsFilter
                onNameChange={(value) =>
                  setProductFilters({ ...productFilters, name: value })
                }
                onStatusChange={(value) =>
                  setProductFilters({ ...productFilters, status: value })
                }
                onReset={() => setProductFilters({ name: '', status: 'all' })}
                nameValue={productFilters.name}
                statusValue={productFilters.status}
                namePlaceholder="Search by product name"
              />
              <Button
                buttonType="action"
                onClick={() => setProductModalOpen(true)}
                className={styles.addButton}
              >
                + Add Product
              </Button>
            </div>
          </Card>
          <ResponsiveTable
            columns={productColumns}
            dataSource={mockProducts}
            loading={false}
            pagination={false}
            mobileColumnsCount={4}
          />
        </>
      ),
    },
    {
      key: 'offer',
      label: 'Offer',
      children: (
        <>
          <Card className={styles.filterCard}>
            <div className={styles.filterSection}>
              <SalesSettingsFilter
                onNameChange={(value) =>
                  setOfferFilters({ ...offerFilters, name: value })
                }
                onStatusChange={(value) =>
                  setOfferFilters({ ...offerFilters, status: value })
                }
                onReset={() => setOfferFilters({ name: '', status: 'all' })}
                nameValue={offerFilters.name}
                statusValue={offerFilters.status}
                namePlaceholder="Search by offer name"
              />
              <Button
                buttonType="action"
                onClick={() => setOfferModalOpen(true)}
                className={styles.addButton}
              >
                + Add Offer
              </Button>
            </div>
          </Card>
          <ResponsiveTable
            columns={offerColumns}
            dataSource={mockOffers}
            loading={false}
            pagination={false}
            mobileColumnsCount={4}
          />
        </>
      ),
    },
    {
      key: 'workflow-statuses',
      label: 'Workflow Statuses',
      children: (
        <>
          <Card className={styles.filterCard}>
            <div className={styles.filterSection}>
              <SalesSettingsFilter
                onNameChange={(value) =>
                  setWorkflowStatusFilters({
                    ...workflowStatusFilters,
                    name: value,
                  })
                }
                onStatusChange={(value) =>
                  setWorkflowStatusFilters({
                    ...workflowStatusFilters,
                    status: value,
                  })
                }
                onReset={() =>
                  setWorkflowStatusFilters({ name: '', status: 'all' })
                }
                nameValue={workflowStatusFilters.name}
                statusValue={workflowStatusFilters.status}
                namePlaceholder="Search by status name"
              />
              <Button
                buttonType="action"
                onClick={() => setWorkflowStatusModalOpen(true)}
                className={styles.addButton}
              >
                + Add Workflow Status
              </Button>
            </div>
          </Card>
          <ResponsiveTable
            columns={workflowStatusColumns}
            dataSource={mockWorkflowStatuses}
            loading={false}
            pagination={false}
            mobileColumnsCount={4}
          />
        </>
      ),
    },
    {
      key: 'import-lead',
      label: 'Import Lead',
      children: (
        <>
          <Card className={styles.filterCard}>
            <div className={styles.filterSection}>
              <SalesSettingsFilter
                onNameChange={(value) =>
                  setImportLeadFilters({ ...importLeadFilters, name: value })
                }
                onStatusChange={(value) =>
                  setImportLeadFilters({ ...importLeadFilters, status: value })
                }
                onReset={() =>
                  setImportLeadFilters({ name: '', status: 'all' })
                }
                nameValue={importLeadFilters.name}
                statusValue={importLeadFilters.status}
                namePlaceholder="Search by file name"
              />
              <Button
                buttonType="action"
                onClick={() => setImportLeadModalOpen(true)}
                className={styles.addButton}
              >
                + Import Lead
              </Button>
            </div>
          </Card>
          <ResponsiveTable
            columns={importLeadColumns}
            dataSource={mockImportLeads}
            loading={false}
            pagination={false}
            mobileColumnsCount={4}
          />
        </>
      ),
    },
    {
      key: 'user-privilege',
      label: 'User Privilege',
      children: (
        <>
          <Card className={styles.filterCard}>
            <div className={styles.filterSection}>
              <SalesSettingsFilter
                onNameChange={(value) =>
                  setUserPrivilegeFilters({
                    ...userPrivilegeFilters,
                    name: value,
                  })
                }
                onStatusChange={(value) =>
                  setUserPrivilegeFilters({
                    ...userPrivilegeFilters,
                    status: value,
                  })
                }
                onReset={() =>
                  setUserPrivilegeFilters({ name: '', status: 'all' })
                }
                nameValue={userPrivilegeFilters.name}
                statusValue={userPrivilegeFilters.status}
                namePlaceholder="Search by user name"
              />
              <Button
                buttonType="action"
                onClick={() => setUserPrivilegeModalOpen(true)}
                className={styles.addButton}
              >
                + Add User Privilege
              </Button>
            </div>
          </Card>
          <ResponsiveTable
            columns={userPrivilegeColumns}
            dataSource={mockUserPrivileges}
            loading={false}
            pagination={false}
            mobileColumnsCount={4}
          />
        </>
      ),
    },
    {
      key: 'schedules',
      label: 'Schedules',
      children: (
        <>
          <Card className={styles.filterCard}>
            <div className={styles.filterSection}>
              <div className={styles.filterPlaceholder}></div>
              <Button
                buttonType="action"
                onClick={() => setScheduleModalOpen(true)}
                className={styles.addButton}
              >
                + Add Schedule
              </Button>
            </div>
          </Card>

          {mockSchedules.map((schedule) => (
            <Card key={schedule.key} className={styles.scheduleCard}>
              <div className={styles.scheduleHeader}>
                <Typography variant="heading4" className={styles.scheduleTitle}>
                  Schedule Info
                </Typography>
                <Button
                  type="text"
                  icon={<EditIconOld />}
                  onClick={() => {
                    setEditingSchedule(schedule);
                    setScheduleModalOpen(true);
                  }}
                  className={styles.editButton}
                />
              </div>

              <div className={styles.salaryInfo}>
                <div className={styles.salaryRow}>
                  <Typography
                    variant="body2"
                    as="span"
                    className={styles.salaryLabel}
                  >
                    Salary Type:
                  </Typography>
                  <Typography
                    variant="body2"
                    as="span"
                    className={styles.salaryValue}
                  >
                    {schedule.salaryType}
                  </Typography>
                </div>
                <div className={styles.salaryRow}>
                  <Typography
                    variant="body2"
                    as="span"
                    className={styles.salaryLabel}
                  >
                    Salary Amount:
                  </Typography>
                  <Typography
                    variant="body2"
                    as="span"
                    className={styles.salaryValue}
                  >
                    {schedule.salaryAmount}
                  </Typography>
                </div>
              </div>

              <div className={styles.scheduleTableContainer}>
                <table className={styles.scheduleTable}>
                  <thead>
                    <tr>
                      <th>
                        <Typography variant="label" as="span">
                          Shift Name
                        </Typography>
                      </th>
                      <th>
                        <Typography variant="label" as="span">
                          Shift Time
                        </Typography>
                      </th>
                      <th>
                        <Typography variant="label" as="span">
                          Work Days
                        </Typography>
                      </th>
                      <th>
                        <Typography variant="label" as="span">
                          Timezone
                        </Typography>
                      </th>
                      <th>
                        <Typography variant="label" as="span">
                          Effective Date
                        </Typography>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <Typography variant="body2">
                          {schedule.shiftName}
                        </Typography>
                      </td>
                      <td>
                        <Typography variant="body2">
                          {schedule.shiftTime}
                        </Typography>
                      </td>
                      <td>
                        <Typography variant="body2">
                          {schedule.workdays}
                        </Typography>
                      </td>
                      <td>
                        <Typography variant="body2">
                          {schedule.timezone}
                        </Typography>
                      </td>
                      <td>
                        <Typography variant="body2">
                          {schedule.effectiveDate}
                        </Typography>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </>
      ),
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <PageTabs
        tabs={tabs}
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
      />

      <LeadSourceModal
        open={leadSourceModalOpen}
        onClose={() => {
          setLeadSourceModalOpen(false);
          setEditingLeadSource(null);
        }}
        onSubmit={(data) => {
          console.log('Lead Source submitted:', data);
          setLeadSourceModalOpen(false);
          setEditingLeadSource(null);
        }}
        initialData={editingLeadSource}
        mode={editingLeadSource ? 'edit' : 'create'}
      />

      <SalesScriptModal
        open={salesScriptModalOpen}
        onClose={() => {
          setSalesScriptModalOpen(false);
          setEditingSalesScript(null);
        }}
        onSubmit={(data) => {
          console.log('Sales Script submitted:', data);
          setSalesScriptModalOpen(false);
          setEditingSalesScript(null);
        }}
        initialData={editingSalesScript}
        mode={editingSalesScript ? 'edit' : 'create'}
      />

      <ProductModal
        open={productModalOpen}
        onClose={() => {
          setProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={(data) => {
          console.log('Product submitted:', data);
          setProductModalOpen(false);
          setEditingProduct(null);
        }}
        initialData={editingProduct}
        mode={editingProduct ? 'edit' : 'create'}
      />

      <OfferModal
        open={offerModalOpen}
        onClose={() => {
          setOfferModalOpen(false);
          setEditingOffer(null);
        }}
        onSubmit={(data) => {
          console.log('Offer submitted:', data);
          setOfferModalOpen(false);
          setEditingOffer(null);
        }}
        initialData={editingOffer}
        mode={editingOffer ? 'edit' : 'create'}
      />

      <WorkflowStatusModal
        open={workflowStatusModalOpen}
        onClose={() => {
          setWorkflowStatusModalOpen(false);
          setEditingWorkflowStatus(null);
        }}
        onSubmit={(data) => {
          console.log('Workflow Status submitted:', data);
          setWorkflowStatusModalOpen(false);
          setEditingWorkflowStatus(null);
        }}
        initialData={editingWorkflowStatus}
        mode={editingWorkflowStatus ? 'edit' : 'create'}
      />

      <ImportLeadModal
        open={importLeadModalOpen}
        onClose={() => setImportLeadModalOpen(false)}
        onSubmit={(data) => {
          console.log('Import Lead submitted:', data);
          setImportLeadModalOpen(false);
        }}
      />

      <UserPrivilegeModal
        open={userPrivilegeModalOpen}
        onClose={() => {
          setUserPrivilegeModalOpen(false);
          setEditingUserPrivilege(null);
        }}
        onSubmit={(data) => {
          console.log('User Privilege submitted:', data);
          setUserPrivilegeModalOpen(false);
          setEditingUserPrivilege(null);
        }}
        initialData={editingUserPrivilege}
        mode={editingUserPrivilege ? 'edit' : 'create'}
      />

      <CreateScheduleModal
        open={scheduleModalOpen}
        onClose={() => {
          setScheduleModalOpen(false);
          setEditingSchedule(null);
        }}
        onSubmit={(data) => {
          console.log('Schedule submitted:', data);
          setScheduleModalOpen(false);
          setEditingSchedule(null);
        }}
        initialData={editingSchedule}
        mode={editingSchedule ? 'edit' : 'create'}
      />
    </div>
  );
}
