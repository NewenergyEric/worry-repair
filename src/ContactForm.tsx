import {ArrowUpRight} from 'lucide-react';
import {useLocale} from './i18n';
import project from './project.json';
export default function ContactForm(){
  const {locale}=useLocale();
  return <div className="demo-invitation"><p>{locale==='zh'?'这里是三张卡的开源示例。完整 24 张工具卡和卡包咨询都在官网。':'This open-source demo contains three cards. Find the full 24-card collection and card-pack enquiries on the official site.'}</p><a className="button primary" href={`${project.siteUrl}?lang=${locale}#tools`} target="_blank" rel="noreferrer">{locale==='zh'?'打开完整官网':'Open the full website'}<ArrowUpRight size={18}/></a></div>;
}
