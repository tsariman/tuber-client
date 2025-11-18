import StatePage from '../../controllers/StatePage';

interface IPageLandingProps {
  def: StatePage;
}

export default function PageLanding({ def: page }: IPageLandingProps) {
  void page;
  return ( null );
}
