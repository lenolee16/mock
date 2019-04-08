import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Modal,
  message,
  Badge,
  Divider,
  Popconfirm
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中'];
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, values } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue, values.projectId);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建项目"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="项目名称">
        {form.getFieldDecorator('projectTitle', {
          rules: [{ required: true, message: '请输入项目名称！'}],
          initialValue: values.projectTitle
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="项目目录">
        {form.getFieldDecorator('projectPath', {
          rules: [{ required: true, message: '请输入项目目录！'}],
          initialValue: values.projectPath
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="项目目录">
        {form.getFieldDecorator('projectType', {
          rules: [{ required: true, message: '请选择项目类型！'}],
          initialValue: values.projectType
        })(
          <Select placeholder="选择项目类型" style={{ width: '100%' }}>
            <Option value="restfulApi">restfulApi</Option>
            <Option value="restMiddleware">restMiddleware</Option>
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="项目描述">
        {form.getFieldDecorator('projectContent', {
          rules: [{ required: true, message: '请输入至少五个字符的项目描述！', min: 5 }],
          initialValue: values.projectContent
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});


/* eslint react/no-multi-comp:0 */
@connect(({ projects, loading }) => ({
  projects,
  loading: loading.models.projects,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    createFormValues: {},
  };

  columns = [
    {
      title: '项目名称',
      dataIndex: 'projectTitle',
    },
    {
      title: '项目类型',
      dataIndex: 'projectType',
    },
    {
      title: '描述',
      dataIndex: 'projectContent',
    },
    {
      title: '接口数',
      dataIndex: 'interfaceCount',
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [
        {
          text: status[0],
          value: 0,
        },
        {
          text: status[1],
          value: 1,
        },
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '修改时间',
      dataIndex: 'updated_at',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleModalVisible(true, record)}>修改</a>
          <Divider type="vertical" />
          <Link to={`/project/list/${record.projectId}`}>配置</Link>
          <Divider type="vertical" />
          <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record.projectId)}>
            <a>删除</a>
          </Popconfirm>

        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.queryData();
  }

  queryData = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'projects/fetch',
      payload: params
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.queryData(params)
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.queryData()
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleDelete = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'projects/remove',
      payload: {
        projectId: id,
      },
      callback: () => {
        message.success('删除成功！');
        this.queryData();
      },
    });
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      this.queryData(values);
    });
  };

  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      createFormValues: record || {},
      isModify: !!record,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'projects/add',
      payload: {
        ...fields
      },
      callback: () => {
        message.success('添加成功');
        this.queryData();
      },
    });
    this.handleModalVisible();
  };

  handleUpdate = (fields, projectId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'projects/update',
      payload: {
        ...fields,
        projectId
      },
      callback: () => {
        message.success('配置成功');
        this.queryData();
      },
    });

    this.handleModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="项目名称">
              {getFieldDecorator('projectTitle')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const {
      projects: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, createFormValues, isModify } = this.state;

    return (
      <PageHeaderWrapper title="项目列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div>
            <StandardTable
              rowKey="projectId"
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              // onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm handleAdd={isModify ? this.handleUpdate : this.handleAdd} handleModalVisible={this.handleModalVisible} modalVisible={modalVisible} values={createFormValues} />
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
