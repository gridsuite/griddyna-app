/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import PropTypes from 'prop-types';
import { CopyButton, DeleteButton } from '../1-atoms/buttons';
import { Grid, Paper, Stack, Typography } from '@mui/material';
import { styles } from './RuleStyle';
import ModelSelect from '../2-molecules/ModelSelect';
import SetGroupSelect from '../2-molecules/SetGroupSelect';
import { mergeSx } from 'utils/functions';

const equipmentLabel = 'Each';
const deleteRuleLabel = 'Delete model';
const copyRuleLabel = 'Copy model';
const matchesLabel = 'Matched network equipments';
const noMatchesLabel = 'None';

const Rule = (props) => {
    const {
        rule,
        isRuleValid = true,
        changeModel,
        models,
        children,
        deleteRule,
        copyRule,
        changeParameters = () => {},
        editGroup = () => {},
        controlledParameters = false,
        isNetworkAttached = false,
    } = props;
    const { type, mappedModel, setGroup, groupType, hasFilter, matches = [] } = rule;

    return (
        <Paper elevation={24} sx={mergeSx(styles.rulePaper, !isRuleValid && styles.invalidRulePaper)}>
            <Grid container>
                <Grid size={{ xs: 12, md: 4 }} paddingRight={1}>
                    <Stack>
                        <Grid container justifyContent="flex-start">
                            <Grid container size="grow">
                                <Grid container justifyContent="flex-start" spacing={1} alignItems="baseline">
                                    <Grid>
                                        <Typography variant="subtitle2">{equipmentLabel}</Typography>
                                    </Grid>
                                    <Grid>
                                        <Typography variant="subtitle1">{type}</Typography>
                                    </Grid>
                                    <Grid>
                                        <Typography variant="subtitle1">:</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid size="auto" paddingLeft={1}>
                                <DeleteButton onClick={deleteRule} tooltip={deleteRuleLabel} />
                                <CopyButton onClick={copyRule} tooltip={copyRuleLabel} />
                            </Grid>
                        </Grid>
                        <Stack sx={styles.ruleModel}>
                            <ModelSelect model={mappedModel} models={models} changeModel={changeModel} />
                            <SetGroupSelect
                                model={mappedModel}
                                models={models}
                                setGroup={setGroup}
                                groupType={groupType}
                                changeGroup={changeParameters}
                                editGroup={editGroup}
                                controlledParameters={controlledParameters}
                                isNetworkAttached={isNetworkAttached}
                            />
                        </Stack>
                    </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>{children}</Grid>
                <Grid size={{ xs: 12, md: 12 }} paddingTop={1}>
                    {isNetworkAttached && hasFilter && (
                        <Paper sx={styles.matches}>
                            <Grid container>
                                <Grid size={4} sx={{ maxHeight: '7em', overflowY: 'auto' }}>
                                    <Typography variant="subtitle1">{`${matchesLabel} :`}</Typography>
                                </Grid>
                                <Grid size={8} sx={{ maxHeight: '7em', overflowY: 'auto' }}>
                                    <Typography>
                                        {matches.length > 0 ? `${matches.join(', ')}` : noMatchesLabel}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Paper>
    );
};
Rule.propTypes = {
    rule: PropTypes.object.isRequired,
    isRuleValid: PropTypes.bool,
    changeModel: PropTypes.func.isRequired,
    models: PropTypes.array.isRequired,
    deleteRule: PropTypes.func.isRequired,
    copyRule: PropTypes.func.isRequired,
    changeParameters: PropTypes.func.isRequired,
    editGroup: PropTypes.func.isRequired,
    controlledParameters: PropTypes.bool,
    isNetworkAttached: PropTypes.bool,
};

export default Rule;
