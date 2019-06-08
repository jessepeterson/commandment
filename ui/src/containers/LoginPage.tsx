import * as React from "react";

import {connect} from "react-redux";
import {RouteComponentProps, RouteProps} from "react-router";
import {Grid, Card, Checkbox, Form, Header, Input, Message} from "semantic-ui-react";
import * as actions from "../store/auth/actions";
import {
    Formik,
    FormikActions,
    FormikProps,
    Form as FormikForm,
    Field,
    FieldProps,
    Label,
    withFormik,
    FormikBag
} from "formik";
import { Button } from "formik-semantic-ui";
import {RootState} from "../reducers";
import {ApiError} from "redux-api-middleware";

interface IFormValues {
    email: string;
    password: string;
}

interface IReduxDispatchProps {
    login: actions.TokenActionRequestCreator;
}

export interface ILoginPageProps extends IReduxDispatchProps {
    apiError?: ApiError;
    loading: boolean;
}

export interface IRouteProps {
    from?: string;
}

const UnconnectedLoginPage: React.FC = (
    props: ILoginPageProps & RouteComponentProps<IRouteProps> & FormikProps<IFormValues>) => {
    const { touched, errors, isSubmitting, handleBlur, values, handleSubmit, login, loading, apiError } = props;

    return (
        <Grid textAlign="center" style={{height: '100vh'}} verticalAlign="middle">
            <Grid.Column style={{maxWidth: 450}}>
                <Card>
                    <Card.Content>
                        <Card.Header>Sign in</Card.Header>
                        <Card.Description>
                            <Form size="large" onSubmit={handleSubmit}>
                                <Form.Field required>
                                    <Input
                                        fluid
                                        icon="user"
                                        iconPosition="left"
                                        placeholder="E-mail address"
                                    />
                                    {errors.email &&
                                    touched.email &&
                                    <Label pointing>{errors.email}</Label>}
                                </Form.Field>
                                <Form.Field required>
                                    <Input
                                        fluid
                                        icon="lock"
                                        iconPosition="left"
                                        placeholder="Password"
                                        type="password"
                                    />
                                    {errors.password &&
                                    touched.password &&
                                    <Label pointing>{errors.password}</Label>}
                                </Form.Field>
                                <Button.Submit color="violet" fluid size="large" type="submit" loading={loading}>
                                    Submit
                                </Button.Submit>

                                {apiError && <Message color="red">
                                    {apiError.response.error_description}
                                </Message>}
                            </Form>
                        </Card.Description>
                    </Card.Content>
                </Card>
            </Grid.Column>
        </Grid>
    );
};

const UnconnectedLoginPageForm = withFormik({
    handleSubmit: (values, formikBag: FormikBag<ILoginPageProps, IFormValues>) => {
        console.log("Submitting");
        formikBag.props.login(values.email, values.password);
        formikBag.setSubmitting(false);
    },

    // validationSchema: Yup.object().shape({
    //     email: Yup.string().required("Required"),
    //     password: Yup.string().required("Required"),
    // }),
})(UnconnectedLoginPage);

export const LoginPage = connect(
    (state: RootState) => ({
        apiError: state.auth.error,
        loading: state.auth.loading,
    }),
    {login: actions.login})(UnconnectedLoginPageForm);
