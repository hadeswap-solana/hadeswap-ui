import { ColumnsType } from 'antd/es/table';
import { createPoolTableRow } from '../../state/core/helpers';
import { Avatar, Col, Row, Typography } from 'antd';
import { formatBNToString } from '../../utils';
import { BN } from 'hadeswap-sdk';
import { TitleWithInfo } from '../../components/TitleWithInfo';
import { shortenAddress } from '../../utils/solanaUtils';


