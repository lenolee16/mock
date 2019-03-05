import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
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
  Popconfirm,
  notification
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
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
      handleAdd(fieldsValue, values.interfaceId);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建接口"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="接口路径">
        {form.getFieldDecorator('interfacePath', {
          rules: [{ required: true, message: '请输入接口路径！'}],
          initialValue: values.interfacePath
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="数据类型">
        {form.getFieldDecorator('dataType', {
          rules: [{ required: true, message: '请输入数据类型！'}],
          initialValue: values.dataType
        })(
          <Select placeholder="选择数据类型" style={{ width: '100%' }}>
            <Option value="json">json</Option>
            <Option value="mockjs">mockjs</Option>
          </Select>
          )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="接口方式">
        {form.getFieldDecorator('method', {
          rules: [{ required: true, message: '请输入接口方式！'}],
          initialValue: values.method
        })(
          <Select placeholder="选择接口方式" style={{ width: '100%' }}>
            <Option value="get">get</Option>
            <Option value="post">post</Option>
            <Option value="put">put</Option>
            <Option value="delete">delete</Option>
          </Select>
          )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="接口描述">
        {form.getFieldDecorator('interfaceDesc', {
          rules: [{ required: true, message: '请输入接口描述！'}],
          initialValue: values.interfaceDesc
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="接口数据">
        {form.getFieldDecorator('interfaceData', {
          rules: [{ required: true, message: '请输入接口数据！', min: 5 }],
          initialValue: values.interfaceData
        })(<TextArea placeholder="请输入标准JSON格式数据,请使用双引号" rows={8} />)}
      </FormItem>
    </Modal>
  );
});


/* eslint react/no-multi-comp:0 */
@connect(({ interfaces, loading }) => ({
  interfaces,
  loading: loading.models.interfaces,
}))
@Form.create()
class TableList extends PureComponent {

  columns = [
    {
      title: '项目名称',
      dataIndex: 'projectTitle',
    },
    {
      title: '接口连接',
      dataIndex: 'interfacePath',
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
    },
    {
      title: '接口描述',
      dataIndex: 'interfaceDesc',
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
        }
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '修改时间',
      dataIndex: 'updatedAt',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleModalVisible(true, record)}>修改</a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record.interfaceId)}>
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => this.testing(record)}>测试</a>
        </Fragment>
      ),
    },
  ];

  constructor (props) {
    super(props);
    
    this.state = {
      modalVisible: false,
      expandForm: false,
      selectedRows: [],
      formValues: {
      },
      createFormValues: {
        dataType: 'json'
      },
      projectId: +props.match.params.id
    };
  }

  componentDidMount() {
    this.queryData();
  }

  queryData = (params = {}) => {
    const { dispatch } = this.props;
    const { projectId } = this.state;
    dispatch({
      type: 'interfaces/fetch',
      payload: {
        projectId,
        ...params
      }
    });
  }

  testing = (record) => {
    const { dispatch } = this.props;
    const { project, interfacePath, method } = record;
    dispatch({
      type: 'interfaces/testing',
      payload: {
        path: project.projectType ===  'restfulApi' ? `${project.projectPath}${interfacePath}` : `${project.projectPath}?${interfacePath}`,
        method: method.toUpperCase()
      },
      callback: (data) => {
        notification.open({
          message: '请求成功！',
          description: <TextArea style={{ width: '500px' }} value={JSON.stringify(data,null,'\t')} rows={20} />
        });
      },
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
      type: 'interfaces/remove',
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
      createFormValues: record || {dataType: 'json'},
      isModify: !!record,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { projectId } = this.state;
    dispatch({
      type: 'interfaces/add',
      payload: {
        ...fields,
        projectId
      },
      callback: (res) => {
        if (res.status) {
          message.success('添加成功');
          this.handleModalVisible();
          this.queryData();
        } else {
          message.error(res.message);
        }
      },
    });
  };

  handleUpdate = (fields,interfaceId) => {
    const { dispatch } = this.props;
    const { projectId } = this.state;
    dispatch({
      type: 'interfaces/update',
      payload: {
        ...fields,
        interfaceId,
        projectId
      },
      callback: (res) => {
        if (res.status) {
          message.success('修改成功');
          this.handleModalVisible();
          this.queryData();
        } else {
          message.error(res.message);
        }
      },
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="接口连接">
              {getFieldDecorator('interfacePath')(<Input placeholder="请输入" />)}
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
      interfaces: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, createFormValues, isModify } = this.state;

    return (
      <PageHeaderWrapper title="项目配置">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div>
            <StandardTable
              rowKey="interfaceId"
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
